import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
    balance: {
        type: Number,
        default: 0,
    }

}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model("Customer", customerSchema);
