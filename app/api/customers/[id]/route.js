import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import {getUserFromRequest} from "@/lib/getUserFromRequest";
import mongoose from "mongoose";

export function validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid ID" },
            { status: 400 }
        );
    }

    return null; // means valid
}

export async function GET(request, context) {
    const user = getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;

    const invalid = validateObjectId(id);
    if (invalid) return invalid;

    const customer = await Customer.findById(id);

    if (!customer) {
        return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(customer);
}

export async function PUT(request, context) {
    const user = getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;
    const body = await request.json();

    const invalid = validateObjectId(id);
    if (invalid) return invalid;

    const updated = await Customer.findByIdAndUpdate(
        id,
        body,
        { new: true }
    );

    if (!updated) {
        return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({
        message: "Updated",
        customer: updated
    });
}

export async function DELETE(request, context) {
    const user = getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;

    const invalid = validateObjectId(id);
    if (invalid) return invalid;

    const deleted = await Customer.findByIdAndDelete(id);

    if (!deleted) {
        return NextResponse.json(
            { error: "Customer not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Deleted" });
}
