import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, email, phone, shopAddress, businessName, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);

        const newUser = await User.create({
            name,
            email,
            phone,
            shopAddress,
            businessName,
            products: [],
            passwordHash,
        });

        return NextResponse.json({ message: "User created", userId: newUser._id });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
