"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", unit: "" });
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to load products");
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            }
        }
        loadProducts();
    }, []);

    async function addProduct(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    price: Number(form.price),
                    unit: form.unit,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setProducts((p) => [...p, data.product]);
            setForm({ name: "", price: "", unit: "" });
        } catch (err) {
            setError(err.message);
        }
    }

    async function saveProduct(p) {
        const res = await fetch(`/api/products/${p._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: p.name,
                price: Number(p.price),
                unit: p.unit,
            }),
        });

        if (!res.ok) alert("Update failed");
    }

    async function deleteProduct(id) {
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        setProducts((p) => p.filter((x) => x._id !== id));
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Products</h1>

            {/* Add product */}
            <form onSubmit={addProduct} className="grid grid-cols-4 gap-4 items-end">
                <input
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border-b bg-transparent outline-none"
                    required
                />
                <input
                    placeholder="Price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border-b bg-transparent outline-none text-right"
                    required
                />
                <input
                    placeholder="Unit"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="border-b bg-transparent outline-none text-right"
                />
                <button className="border px-4 py-1">Add</button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            {/* Table */}
            <div className="divide-y divide-fg/10">
                {/* Header */}
                <div className="grid grid-cols-4 py-2 text-xs text-fg/50">
                    <span>Name</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Unit</span>
                    <span className="text-right">Actions</span>
                </div>

                {products.map((p) => (
                    <div key={p._id} className="grid grid-cols-4 items-center py-3 gap-4">
                        <input
                            value={p.name}
                            onChange={(e) =>
                                setProducts((prev) =>
                                    prev.map((x) =>
                                        x._id === p._id ? { ...x, name: e.target.value } : x
                                    )
                                )
                            }
                            className="bg-transparent outline-none border-b border-transparent focus:border-fg/40"
                        />

                        <input
                            type="number"
                            value={p.price}
                            onChange={(e) =>
                                setProducts((prev) =>
                                    prev.map((x) =>
                                        x._id === p._id ? { ...x, price: e.target.value } : x
                                    )
                                )
                            }
                            className="bg-transparent outline-none border-b border-transparent focus:border-fg/40 text-right"
                        />

                        <input
                            value={p.unit || ""}
                            onChange={(e) =>
                                setProducts((prev) =>
                                    prev.map((x) =>
                                        x._id === p._id ? { ...x, unit: e.target.value } : x
                                    )
                                )
                            }
                            className="bg-transparent outline-none border-b border-transparent focus:border-fg/40 text-right"
                        />

                        <div className="text-right space-x-4">
                            <button
                                onClick={() => saveProduct(p)}
                                className="text-xs text-fg/60 hover:text-fg transition"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => deleteProduct(p._id)}
                                className="text-xs text-red-500/70 hover:text-red-500 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <p className="py-6 text-fg/50">No products added yet.</p>
                )}
            </div>
        </div>
    );
}
