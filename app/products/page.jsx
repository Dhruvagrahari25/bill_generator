"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: "", desc: "", price: "", unit: "" });
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
                    desc: form.desc,
                    price: Number(form.price),
                    unit: form.unit,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setProducts((p) => [...p, data.product]);
            setForm({ name: "", desc: "", price: "", unit: "" });
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
                desc: p.desc,
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
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Products</h1>

            {/* Add product */}
            <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-fg/5 p-4 rounded-lg md:bg-transparent md:p-0">
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Name</label>
                    <input
                        placeholder="Product name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Description</label>
                    <input
                        placeholder="Description"
                        value={form.desc}
                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Price</label>
                    <input
                        placeholder="Price"
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1 md:text-right"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Unit</label>
                    <input
                        placeholder="Unit"
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1 md:text-right"
                    />
                </div>
                <button className="border px-4 py-2 bg-fg text-bg md:bg-transparent md:text-fg hover:opacity-90 transition rounded md:rounded-none">Add</button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            {/* Table */}
            <div className="space-y-4 md:space-y-0 md:divide-y md:divide-fg/10">
                {/* Header */}
                <div className="hidden md:grid grid-cols-5 py-2 text-xs text-fg/50">
                    <span>Name</span>
                    <span>Description</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Unit</span>
                    <span className="text-right">Actions</span>
                </div>

                {products.map((p) => (
                    <div key={p._id} className="flex flex-col md:grid md:grid-cols-5 items-start md:items-center p-4 md:py-3 gap-4 bg-fg/5 md:bg-transparent rounded-lg md:rounded-none border border-fg/5 md:border-none">

                        <div className="w-full md:contents">
                            <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Name</label>
                            <input
                                value={p.name}
                                onChange={(e) =>
                                    setProducts((prev) =>
                                        prev.map((x) =>
                                            x._id === p._id ? { ...x, name: e.target.value } : x
                                        )
                                    )
                                }
                                className="bg-transparent outline-none border-b border-fg/10 md:border-transparent focus:border-fg/40 w-full font-medium"
                            />
                        </div>

                        <div className="w-full md:contents">
                            <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Description</label>
                            <input
                                value={p.desc || ""}
                                onChange={(e) =>
                                    setProducts((prev) =>
                                        prev.map((x) =>
                                            x._id === p._id ? { ...x, desc: e.target.value } : x
                                        )
                                    )
                                }
                                className="bg-transparent outline-none border-b border-fg/10 md:border-transparent focus:border-fg/40 w-full text-sm text-fg/70"
                                placeholder="No description"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full md:contents">
                            <div className="md:contents">
                                <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Price</label>
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
                                    className="bg-transparent outline-none border-b border-fg/10 md:border-transparent focus:border-fg/40 w-full md:text-right"
                                />
                            </div>

                            <div className="md:contents">
                                <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Unit</label>
                                <input
                                    value={p.unit || ""}
                                    onChange={(e) =>
                                        setProducts((prev) =>
                                            prev.map((x) =>
                                                x._id === p._id ? { ...x, unit: e.target.value } : x
                                            )
                                        )
                                    }
                                    className="bg-transparent outline-none border-b border-fg/10 md:border-transparent focus:border-fg/40 w-full md:text-right"
                                />
                            </div>
                        </div>

                        <div className="flex w-full md:w-auto justify-end gap-3 mt-2 md:mt-0 md:text-right md:block space-x-4">
                            <button
                                onClick={() => saveProduct(p)}
                                className="text-sm md:text-xs text-fg/60 hover:text-fg transition border border-fg/20 md:border-none px-4 py-1.5 md:p-0 rounded bg-bg md:bg-transparent"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => deleteProduct(p._id)}
                                className="text-sm md:text-xs text-red-500/70 hover:text-red-500 transition border border-red-500/20 md:border-none px-4 py-1.5 md:p-0 rounded bg-bg md:bg-transparent"
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
