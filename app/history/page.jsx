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
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 bg-[var(--bg)] text-[var(--fg)]">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Bill History</h1>
                <Link href="/create-new-bill" className="border px-4 py-2 md:py-1 text-sm rounded md:rounded-none bg-[var(--fg)] text-[var(--bg)] md:bg-transparent md:text-[var(--fg)] hover:opacity-90 transition">
                    Create Bill
                </Link>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4 md:space-y-0 md:divide-y md:divide-[var(--fg)]/10">
                <div className="hidden md:grid grid-cols-6 py-2 text-xs text-[var(--fg)]/50">
                    <span>Date</span>
                    <span>Customer</span>
                    <span className="text-right">Items</span>
                    <span className="text-right">Total</span>
                    <span className="text-right">Balance</span>
                    <span className="text-right">Actions</span>
                </div>

                {bills.map(b => (
                    <div key={b._id} className="flex flex-col md:grid md:grid-cols-6 items-start md:items-center p-4 md:py-3 gap-3 md:gap-4 bg-[var(--fg)]/5 md:bg-transparent rounded-lg md:rounded-none border border-[var(--fg)]/5 md:border-none">
                        <div className="w-full md:contents flex justify-between items-center">
                            <span className="md:hidden text-xs text-[var(--fg)]/50 font-medium">Date</span>
                            <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="w-full md:contents flex justify-between items-center">
                            <span className="md:hidden text-xs text-[var(--fg)]/50 font-medium">Customer</span>
                            <span className="truncate font-medium md:font-normal">{b.customerId?.name || "—"}</span>
                        </div>

                        <div className="w-full md:contents flex justify-between items-center">
                            <span className="md:hidden text-xs text-[var(--fg)]/50 font-medium">Items</span>
                            <span className="md:text-right">{b.products.length}</span>
                        </div>

                        <div className="w-full md:contents flex justify-between items-center">
                            <span className="md:hidden text-xs text-[var(--fg)]/50 font-medium">Total</span>
                            <span className="md:text-right font-bold md:font-normal">₹{b.total}</span>
                        </div>

                        <div className="w-full md:contents flex justify-between items-center">
                            <span className="md:hidden text-xs text-[var(--fg)]/50 font-medium">Balance</span>
                            <span className="md:text-right text-red-600">₹{b.customerId?.balance ?? 0}</span>
                        </div>

                        <div className="w-full md:w-auto flex justify-end md:block text-right space-x-4 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-[var(--fg)]/10 md:border-none">
                            <Link href={`/history/${b._id}`} className="inline-block text-sm md:text-xs text-[var(--fg)]/60 hover:text-[var(--fg)] border border-[var(--fg)]/20 md:border-none px-4 py-1.5 md:p-0 rounded bg-[var(--bg)] md:bg-transparent">
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
