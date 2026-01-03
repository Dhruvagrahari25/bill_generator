import mongoose from "mongoose";

const billProductSchema = new mongoose.Schema({
    product: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        desc: { type: String },
        price: { type: Number, required: true },
        unit: { type: String },
    },
    quantity: { type: Number, required: true },
});

const billSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    products: [billProductSchema],
    subtotal: { type: Number, required: true },
    discounts: {
        percent: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
    },
    additionalFees: { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    partialPayment: { type: Number, default: 0 },
    total: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Bill || mongoose.model("Bill", billSchema);
