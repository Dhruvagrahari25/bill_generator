"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HistoryPage() {
    const [bills, setBills] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/bills")
            .then(res => res.json())
            .then(setBills)
            .catch(e => setError(e.message));
    }, []);

    // async function deleteBill(id) {
    //     await fetch(`/api/bills/${id}`, { method: "DELETE" });
    //     setBills(b => b.filter(x => x._id !== id));
    // }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[var(--bg)] text-[var(--fg)]">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Bill History</h1>
                <Link href="/create-new-bill" className="border px-4 py-1 text-sm">
                    Create Bill
                </Link>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="divide-y divide-[var(--fg)]/10">
                <div className="grid grid-cols-6 py-2 text-xs text-[var(--fg)]/50">
                    <span>Date</span>
                    <span>Customer</span>
                    <span className="text-right">Items</span>
                    <span className="text-right">Total</span>
                    <span className="text-right">Balance</span>
                    <span className="text-right">Actions</span>
                </div>

                {bills.map(b => (
                    <div key={b._id} className="grid grid-cols-6 items-center py-3 gap-4">
                        <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                        <span className="truncate">{b.customerId?.name || "—"}</span>
                        <span className="text-right">{b.products.length}</span>
                        <span className="text-right">₹{b.total}</span>
                        <span className="text-right text-red-600">₹{b.customerId?.balance ?? 0}</span>
                        <div className="text-right space-x-4">
                            <Link href={`/history/${b._id}`} className="text-xs text-[var(--fg)]/60">
                                View
                            </Link>
                        </div>
                    </div>
                ))}

                {bills.length === 0 && (
                    <p className="py-6 text-[var(--fg)]/50">No bills created yet.</p>
                )}
            </div>
        </div>
    );
}
