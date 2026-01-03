import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function GET(request, context) {
    const auth = getUserFromRequest(request);
    if (!auth)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    await connectDB();

    const product = await Product.findOne({
        _id: id,
        sellerId: auth.userId,
    });

    if (!product)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(product);
}

export async function PUT(request, context) {
    const auth = getUserFromRequest(request);
    if (!auth)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const data = await request.json();

    await connectDB();

    const product = await Product.findOneAndUpdate(
        { _id: id, sellerId: auth.userId },
        data,
        { new: true }
    );

    if (!product)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(product);
}

export async function DELETE(request, context) {
    const auth = getUserFromRequest(request);
    if (!auth)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    await connectDB();

    const product = await Product.findOneAndDelete({
        _id: id,
        sellerId: auth.userId,
    });

    if (!product)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

    await User.findByIdAndUpdate(auth.userId, {
        $pull: { products: id },
    });

    return NextResponse.json({ success: true });
}
