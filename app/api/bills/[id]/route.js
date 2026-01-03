import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Bill from "@/models/Bill";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

// export async function PATCH(request, context) {
//     const auth = getUserFromRequest(request);
//     if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//
//     const { id } = await context.params;
//     const {
//         products,
//         discounts = {},
//         additionalFees = 0,
//         partialPayment = 0,
//     } = await request.json();
//
//     await connectDB();
//     const session = await mongoose.startSession();
//     session.startTransaction();
//
//     try {
//         const bill = await Bill.findOne(
//             { _id: id, sellerId: auth.userId },
//             null,
//             { session }
//         );
//
//         if (!bill)
//             return NextResponse.json({ error: "Bill not found" }, { status: 404 });
//
//         const oldPartial = bill.partialPayment;
//
//         if (products) {
//             const dbProducts = await Product.find(
//                 { _id: { $in: products.map(p => p.productId) } },
//                 null,
//                 { session }
//             );
//
//             let subtotal = 0;
//             const detailedProducts = products.map(p => {
//                 const prod = dbProducts.find(x => x.id === p.productId);
//                 const lineTotal = prod.price * p.quantity;
//                 subtotal += lineTotal;
//                 return { product: prod, quantity: p.quantity };
//             });
//
//             const discountValue =
//                 (subtotal * (discounts.percent || 0)) / 100 +
//                 (discounts.amount || 0);
//
//             bill.products = detailedProducts;
//             bill.subtotal = subtotal;
//             bill.discounts = discounts;
//             bill.additionalFees = additionalFees;
//             bill.total = Math.max(0, subtotal - discountValue + additionalFees);
//         }
//
//         bill.partialPayment = partialPayment;
//
//         if (partialPayment >= bill.total) bill.paymentStatus = "paid";
//         else if (partialPayment > 0) bill.paymentStatus = "partial";
//         else bill.paymentStatus = "unpaid";
//
//         const deltaPaid = partialPayment - oldPartial;
//
//         await bill.save({ session });
//
//         if (deltaPaid !== 0) {
//             await Customer.findByIdAndUpdate(
//                 bill.customerId,
//                 { $inc: { balance: -deltaPaid } },
//                 { session }
//             );
//         }
//
//         await session.commitTransaction();
//         session.endSession();
//
//         return NextResponse.json(bill);
//     } catch (e) {
//         await session.abortTransaction();
//         session.endSession();
//         return NextResponse.json({ error: e.message }, { status: 500 });
//     }
// }

export async function PATCH(request, context) {
    const auth = getUserFromRequest(request);
    if (!auth)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const {
        products = [],
        discounts = { percent: 0, amount: 0 },
        additionalFees = 0,
        partialPayment = 0,
    } = await request.json();

    await connectDB();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const bill = await Bill.findOne(
            { _id: id, sellerId: auth.userId },
            null,
            { session }
        );

        if (!bill)
            return NextResponse.json({ error: "Bill not found" }, { status: 404 });

        /* ✅ VALIDATE & NORMALIZE PRODUCTS (SCHEMA-SAFE) */
        const cleanProducts = products.filter(
            p =>
                p.product &&
                p.product._id &&
                mongoose.Types.ObjectId.isValid(p.product._id) &&
                p.product.name &&
                typeof p.product.price === "number" &&
                p.quantity > 0
        );

        if (cleanProducts.length === 0)
            return NextResponse.json(
                { error: "At least one valid product required" },
                { status: 400 }
            );

        /* ---- CAPTURE OLD STATE ---- */
        const oldTotal = bill.total;
        const oldPartial = bill.partialPayment;

        /* ---- TOTALS ---- */
        let subtotal = 0;
        bill.products = cleanProducts.map(p => {
            subtotal += p.product.price * p.quantity;
            return {
                product: {
                    _id: p.product._id,
                    name: p.product.name,
                    desc: p.product.desc || "",
                    price: p.product.price,
                    unit: p.product.unit || "",
                },
                quantity: p.quantity,
            };
        });

        const discountValue =
            (subtotal * (discounts.percent || 0)) / 100 +
            (discounts.amount || 0);

        bill.subtotal = subtotal;
        bill.discounts = discounts;
        bill.additionalFees = additionalFees;
        bill.total = Math.max(0, subtotal - discountValue + additionalFees);

        /* ---- PAYMENT ---- */
        bill.partialPayment = partialPayment;

        if (partialPayment >= bill.total) bill.paymentStatus = "paid";
        else if (partialPayment > 0) bill.paymentStatus = "partial";
        else bill.paymentStatus = "unpaid";

        await bill.save({ session });

        /* ---- UPDATE CUSTOMER BALANCE ---- */
        const oldUnpaid = oldTotal - oldPartial;
        const newUnpaid = bill.total - bill.partialPayment;
        const deltaBalance = newUnpaid - oldUnpaid;

        if (deltaBalance !== 0) {
            await Customer.findByIdAndUpdate(
                bill.customerId,
                { $inc: { balance: deltaBalance } },
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(bill);
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}


export async function GET(request, context) {
    const auth = getUserFromRequest(request);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    await connectDB();

    const bill = await Bill.findOne({
        _id: id,
        sellerId: auth.userId,
    }).populate("customerId", "name balance");

    if (!bill)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(bill);
}
