import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(request) {
    try {
        const auth = getUserFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await request.json();
        const { name, email, phone, address } = body;

        if (!name) {
            return NextResponse.json({ error: "Name required" }, { status: 400 });
        }

        const customer = await Customer.create({
            name,
            email,
            phone,
            address,
            sellerId: auth.userId,
            orderHistory: [],
        });

        await User.findByIdAndUpdate(auth.userId, {
            $push: { customers: customer._id },
        });

        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        const auth = getUserFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await User.findById(auth.userId).select("customers");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const customers = await Customer.find({
            _id: { $in: user.customers },
        });

        return NextResponse.json(customers);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
