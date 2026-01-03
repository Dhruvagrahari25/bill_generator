"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchSelect from "@/components/SearchSelect";

export default function CreateNewBillPage() {
    const router = useRouter();

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [customer, setCustomer] = useState(null);
    const [discount, setDiscount] = useState({ percent: 0, amount: 0 });
    const [additionalFees, setAdditionalFees] = useState(0);
    const [error, setError] = useState("");

    const qtyRefs = useRef([]);

    /* Load customers & products */
    useEffect(() => {
        Promise.all([
            fetch("/api/customers").then(r => r.json()),
            fetch("/api/products").then(r => r.json()),
        ])
            .then(([c, p]) => {
                setCustomers(Array.isArray(c) ? c : []);
                setProducts(Array.isArray(p) ? p : []);
            })
            .catch(err => setError(err.message));
    }, []);

    function addItem(focus = true) {
        setItems(i => [...i, { product: null, quantity: 1 }]);
        if (focus) {
            setTimeout(() => {
                qtyRefs.current[items.length]?.focus();
            }, 0);
        }
    }

    function updateItem(index, field, value) {
        setItems(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    }

    function removeItem(index) {
        setItems(prev => prev.filter((_, i) => i !== index));
    }

    /* Live calculations */
    const subtotal = useMemo(() => {
        return items.reduce((sum, item) => {
            if (!item.product) return sum;
            return sum + item.product.price * item.quantity;
        }, 0);
    }, [items]);

    const discountValue =
        (subtotal * discount.percent) / 100 + discount.amount;

    const total = Math.max(
        0,
        subtotal - discountValue + Number(additionalFees)
    );

    async function createBill() {
        setError("");

        if (!customer) return setError("Please select a customer");
        if (items.length === 0) return setError("Please add at least one item");

        const payloadItems = items
            .filter(i => i.product)
            .map(i => ({
                productId: i.product._id,
                quantity: i.quantity,
            }));

        if (payloadItems.length === 0)
            return setError("Please select products for all items");

        try {
            const res = await fetch("/api/bills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: customer._id,
                    products: payloadItems,
                    discounts: discount,
                    additionalFees: Number(additionalFees),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            router.push("/history");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10">
            <h1 className="text-2xl font-semibold">Create New Bill</h1>
            {error && <p className="text-red-500">{error}</p>}

            {/* Customer */}
            <SearchSelect
                options={customers}
                value={customer}
                onChange={setCustomer}
                placeholder="Search customer"
            />

            {/* Items */}
            <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-6 text-xs text-fg/50">
                    <span>Product</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Unit</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Total</span>
                    <span />
                </div>

                {items.map((item, i) => {
                    const price = item.product?.price || 0;

                    return (
                        <div
                            key={i}
                            className="grid grid-cols-6 gap-4 items-end"
                        >
                            <SearchSelect
                                options={products}
                                value={item.product}
                                onChange={(p) =>
                                    updateItem(i, "product", p)
                                }
                                placeholder="Search product"
                            />

                            <input
                                ref={el => (qtyRefs.current[i] = el)}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={e =>
                                    updateItem(
                                        i,
                                        "quantity",
                                        Number(e.target.value)
                                    )
                                }
                                onKeyDown={e => {
                                    if (e.key === "Enter" && i === items.length - 1)
                                        addItem();
                                    if (
                                        e.key === "Backspace" &&
                                        item.quantity === 1
                                    )
                                        removeItem(i);
                                }}
                                className="border-b bg-transparent outline-none text-right"
                            />

                            <span className="text-right text-fg/60">
                                {item.product?.unit || "—"}
                            </span>

                            <span className="text-right text-fg/60">
                                ₹{price}
                            </span>

                            <span className="text-right">
                                ₹{price * item.quantity}
                            </span>

                            <button
                                onClick={() => removeItem(i)}
                                className="text-xs text-red-500/70"
                            >
                                Remove
                            </button>
                        </div>
                    );
                })}

                <div className="pt-4">
                    <button
                        onClick={() => addItem()}
                        className="border px-4 py-1 text-sm"
                    >
                        + Add Item
                    </button>
                </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-6 space-y-3 text-right">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span>Discount (%)</span>
                    <input
                        type="number"
                        value={discount.percent}
                        onChange={(e) =>
                            setDiscount({
                                ...discount,
                                percent: Number(e.target.value),
                            })
                        }
                        className="border-b bg-transparent outline-none text-right w-24"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <span>Discount (₹)</span>
                    <input
                        type="number"
                        value={discount.amount}
                        onChange={(e) =>
                            setDiscount({
                                ...discount,
                                amount: Number(e.target.value),
                            })
                        }
                        className="border-b bg-transparent outline-none text-right w-24"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <span>Additional Fees</span>
                    <input
                        type="number"
                        value={additionalFees}
                        onChange={(e) => setAdditionalFees(e.target.value)}
                        className="border-b bg-transparent outline-none text-right w-24"
                    />
                </div>

                <div className="border-t pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total}</span>
                </div>

                <div className="flex justify-between text-fg/70">
                    <span>Balance Due</span>
                    <span>
            ₹{customer?.balance || 0}
        </span>
                </div>

                <div className="border-t pt-3 flex justify-between text-xl font-semibold">
                    <span>Grand Total</span>
                    <span>
            ₹{total + (customer?.balance || 0)}
        </span>
                </div>
            </div>

            <button
                onClick={createBill}
                className="border px-6 py-2"
            >
                Create Bill
            </button>
        </div>
    );
}
