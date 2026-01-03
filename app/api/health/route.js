import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ status: "DB connected" });
    } catch (error) {
        return NextResponse.json({ status: "Error", message: error.message });
    }
}
