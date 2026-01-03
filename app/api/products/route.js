import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(request) {
    try {
        const auth = getUserFromRequest(request);
        if (!auth) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { name, desc, price, unit } = await request.json();

        const product = await Product.create({
            sellerId: auth.userId,
            name,
            desc,
            price,
            unit,
        });

        await User.findByIdAndUpdate(auth.userId, {
            $push: { products: product._id },
        });

        return NextResponse.json({ message: "Product created", product });
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

        const products = await Product.find({ sellerId: auth.userId });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
