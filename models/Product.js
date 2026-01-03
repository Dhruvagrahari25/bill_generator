import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String },
    price: { type: Number, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    unit: { type: String }, // e.g., "Kg", "grams", "packets"
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", productSchema);
