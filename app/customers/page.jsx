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
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
            <h1 className="text-2xl font-semibold">Customers</h1>

            {/* Add customer */}
            <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-fg/5 p-4 rounded-lg md:bg-transparent md:p-0">
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Name</label>
                    <input
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1"
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Email</label>
                    <input
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Phone</label>
                    <input
                        placeholder="Phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="md:hidden text-xs text-fg/50">Address</label>
                    <input
                        placeholder="Address"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="border-b bg-transparent outline-none w-full py-1"
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
                    <span>Email</span>
                    <span>Phone</span>
                    <span>Address</span>
                    <span className="text-right">Actions</span>
                </div>

                {customers.map((c) => (
                    <div
                        key={c._id}
                        className="flex flex-col md:grid md:grid-cols-5 items-start md:items-center p-4 md:py-3 gap-4 bg-fg/5 md:bg-transparent rounded-lg md:rounded-none border border-fg/5 md:border-none"
                    >
                        <div className="w-full md:contents">
                            <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Name</label>
                            <input
                                value={c.name}
                                onChange={(e) =>
                                    setCustomers((prev) =>
                                        prev.map((x) =>
                                            x._id === c._id ? { ...x, name: e.target.value } : x
                                        )
                                    )
                                }
                                className="bg-transparent border-b border-fg/10 md:border-transparent focus:border-fg/40 outline-none w-full font-medium"
                            />
                        </div>

                        <div className="w-full md:contents">
                            <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Email</label>
                            <input
                                value={c.email || ""}
                                onChange={(e) =>
                                    setCustomers((prev) =>
                                        prev.map((x) =>
                                            x._id === c._id ? { ...x, email: e.target.value } : x
                                        )
                                    )
                                }
                                className="bg-transparent border-b border-fg/10 md:border-transparent focus:border-fg/40 outline-none w-full"
                            />
                        </div>

                        <div className="w-full md:contents">
                            <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Phone</label>
                            <input
                                value={c.phone || ""}
                                onChange={(e) =>
                                    setCustomers((prev) =>
                                        prev.map((x) =>
                                            x._id === c._id ? { ...x, phone: e.target.value } : x
                                        )
                                    )
                                }
                                className="bg-transparent border-b border-fg/10 md:border-transparent focus:border-fg/40 outline-none w-full"
                            />
                        </div>

                        <div className="w-full md:contents">
                            <label className="md:hidden text-xs text-fg/50 font-medium mb-1 block">Address</label>
                            <input
                                value={c.address || ""}
                                onChange={(e) =>
                                    setCustomers((prev) =>
                                        prev.map((x) =>
                                            x._id === c._id ? { ...x, address: e.target.value } : x
                                        )
                                    )
                                }
                                className="bg-transparent border-b border-fg/10 md:border-transparent focus:border-fg/40 outline-none w-full"
                            />
                        </div>

                        <div className="flex w-full md:w-auto justify-end gap-3 mt-2 md:mt-0 md:text-right md:block space-x-4">
                            <button
                                onClick={() => save(c)}
                                className="text-sm md:text-xs text-fg/60 hover:text-fg transition border border-fg/20 md:border-none px-4 py-1.5 md:p-0 rounded bg-bg md:bg-transparent"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => remove(c._id)}
                                className="text-sm md:text-xs text-red-500/70 hover:text-red-500 transition border border-red-500/20 md:border-none px-4 py-1.5 md:p-0 rounded bg-bg md:bg-transparent"
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
