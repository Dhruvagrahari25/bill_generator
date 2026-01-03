import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import Customer from "@/models/Customer";
import User from "@/models/User";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(request) {
    const auth = getUserFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sellerId = auth.userId;
        const { customerId, products, discounts = {}, additionalFees = 0 } =
            await request.json();

        const dbProducts = await Product.find(
            { _id: { $in: products.map(p => p.productId) }, sellerId },
            null,
            { session }
        );

        let subtotal = 0;
        const detailedProducts = products.map(p => {
            const prod = dbProducts.find(x => x.id === p.productId);
            const lineTotal = prod.price * p.quantity;
            subtotal += lineTotal;
            return { product: prod, quantity: p.quantity, lineTotal };
        });

        const discountValue =
            (subtotal * (discounts.percent || 0)) / 100 + (discounts.amount || 0);

        const total = Math.max(0, subtotal - discountValue + additionalFees);

        const [bill] = await Bill.create([{
            sellerId,
            customerId,
            products: detailedProducts,
            subtotal,
            discounts,
            additionalFees,
            total,
            paidAmount: 0,
            status: "UNPAID",
        }], { session });

        await Customer.findByIdAndUpdate(
            customerId,
            { $inc: { balance: total }, $push: { orderHistory: bill._id } },
            { session }
        );

        await User.findByIdAndUpdate(
            sellerId,
            { $push: { orderHistory: bill._id } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(bill);
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(request) {
    const auth = getUserFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const bills = await Bill.find({ sellerId: auth.userId })
        .populate("customerId", "name balance")
        .sort({ createdAt: -1 });

    return NextResponse.json(bills);
}
