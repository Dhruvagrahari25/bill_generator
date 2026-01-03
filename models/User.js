import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    shopAddress: { type: String },
    businessName: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }],
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bill" }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
