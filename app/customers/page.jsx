"use client";
import { useEffect, useState } from "react";

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            const res = await fetch("/api/customers");
            const data = await res.json();
            setCustomers(Array.isArray(data) ? data : []);
        }
        load();
    }, []);

    async function add(e) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) return setError(data.error);

        setCustomers((c) => [...c, data]);
        setForm({ name: "", email: "", phone: "", address: "" });
    }

    async function save(c) {
        await fetch(`/api/customers/${c._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: c.name,
                email: c.email,
                phone: c.phone,
                address: c.address,
            }),
        });
    }

    async function remove(id) {
        await fetch(`/api/customers/${id}`, { method: "DELETE" });
        setCustomers((c) => c.filter((x) => x._id !== id));
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Customers</h1>

            {/* Add customer */}
            <form onSubmit={add} className="grid grid-cols-5 gap-4 items-end">
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border-b bg-transparent"
                    required
                />
                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border-b bg-transparent"
                />
                <input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="border-b bg-transparent"
                />
                <input
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="border-b bg-transparent"
                />
                <button className="border px-4 py-1">Add</button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            {/* Table */}
            <div className="divide-y divide-fg/10">
                {/* Header */}
                <div className="grid grid-cols-5 py-2 text-xs text-fg/50">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Phone</span>
                    <span>Address</span>
                    <span className="text-right">Actions</span>
                </div>

                {customers.map((c) => (
                    <div
                        key={c._id}
                        className="grid grid-cols-5 items-center py-3 gap-4"
                    >
                        <input
                            value={c.name}
                            onChange={(e) =>
                                setCustomers((prev) =>
                                    prev.map((x) =>
                                        x._id === c._id ? { ...x, name: e.target.value } : x
                                    )
                                )
                            }
                            className="bg-transparent border-b border-transparent focus:border-fg/40 outline-none"
                        />

                        <input
                            value={c.email || ""}
                            onChange={(e) =>
                                setCustomers((prev) =>
                                    prev.map((x) =>
                                        x._id === c._id ? { ...x, email: e.target.value } : x
                                    )
                                )
                            }
                            className="bg-transparent border-b border-transparent focus:border-fg/40 outline-none"
                        />

                        <input
                            value={c.phone || ""}
                            onChange={(e) =>
                                setCustomers((prev) =>
                                    prev.map((x) =>
                                        x._id === c._id ? { ...x, phone: e.target.value } : x
                                    )
                                )
                            }
                            className="bg-transparent border-b border-transparent focus:border-fg/40 outline-none"
                        />

                        <input
                            value={c.address || ""}
                            onChange={(e) =>
                                setCustomers((prev) =>
                                    prev.map((x) =>
                                        x._id === c._id ? { ...x, address: e.target.value } : x
                                    )
                                )
                            }
                            className="bg-transparent border-b border-transparent focus:border-fg/40 outline-none"
                        />

                        <div className="text-right space-x-4">
                            <button
                                onClick={() => save(c)}
                                className="text-xs text-fg/60 hover:text-fg"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => remove(c._id)}
                                className="text-xs text-red-500/70 hover:text-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {customers.length === 0 && (
                    <p className="py-6 text-fg/50">No customers added yet.</p>
                )}
            </div>
        </div>
    );
}
