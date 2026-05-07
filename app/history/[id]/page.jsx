"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SearchSelect from "@/components/SearchSelect";
import { ArrowLeft, Printer, Save, X, Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ViewBillPage() {
    const { id } = useParams();

    const [bill, setBill] = useState(null);
    const [draft, setDraft] = useState(null);
    const [edit, setEdit] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    /* Load bill + products */
    useEffect(() => {
        Promise.all([
            fetch(`/api/bills/${id}`).then(r => r.json()),
            fetch("/api/products").then(r => r.json()),
        ]).then(([b, p]) => {
            setBill(b);
            setDraft(JSON.parse(JSON.stringify(b)));
            setAllProducts(p);
        });
    }, [id]);

    /* totals */
    const subtotal = useMemo(() => {
        if (!draft) return 0;
        return draft.products.reduce((s, p) => {
            if (!p.product) return s;
            return s + (p.product.price || 0) * (p.quantity || 0);
        }, 0);
    }, [draft]);

    const discountValue = draft ?
        (subtotal * (draft.discounts?.percent || 0)) / 100 +
        (draft.discounts?.amount || 0) : 0;

    const total = draft ? Math.max(
        0,
        subtotal - discountValue + Number(draft.additionalFees || 0)
    ) : 0;

    const balanceDue = draft ? total - (draft.partialPayment || 0) : 0;

    /* Auto-update payment status */
    useEffect(() => {
        if (!draft) return;
        const pay = Number(draft.partialPayment || 0);
        const t = total;

        let newStatus = "unpaid";
        if (pay >= t) newStatus = "paid";
        else if (pay > 0) newStatus = "partial";

        if (draft.paymentStatus !== newStatus) {
            setDraft(d => ({ ...d, paymentStatus: newStatus }));
        }
    }, [draft?.partialPayment, total]);

    if (!bill || !draft) return <div className="p-10">Loading...</div>;

    /* helpers */
    function updateRow(i, updater) {
        setDraft(d => ({
            ...d,
            products: d.products.map((p, j) =>
                i === j ? updater(p) : p
            )
        }));
    }

    function addItem() {
        setDraft(d => ({
            ...d,
            products: [...d.products, { product: null, quantity: 1 }]
        }));
    }

    function removeItem(i) {
        setDraft(d => ({
            ...d,
            products: d.products.filter((_, j) => j !== i)
        }));
    }

    /* save */
    async function save() {
        const res = await fetch(`/api/bills/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                products: draft.products
                    .filter(p => p.product && p.product._id)
                    .map(p => ({
                        product: {
                            _id: p.product._id,
                            name: p.product.name,
                            desc: p.product.desc || "",
                            price: Number(p.product.price),
                            unit: p.product.unit || "",
                        },
                        quantity: Number(p.quantity),
                    })),
                discounts: draft.discounts,
                additionalFees: Number(draft.additionalFees),
                partialPayment: Number(draft.partialPayment || 0),
            }),
        });

        if (res.ok) {
            const updatedBill = await res.json();
            // We need to re-fetch the customer to get the updated balance
            // Or we can just re-fetch the whole bill which populates customer
            const freshBill = await fetch(`/api/bills/${id}`).then(r => r.json());
            setBill(freshBill);
            setDraft(JSON.parse(JSON.stringify(freshBill)));
            setEdit(false);
        } else {
            alert("Failed to save bill");
        }
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit"
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] p-4 md:p-8 print:p-0 print:bg-white transition-colors duration-200">
            {/* Toolbar */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <Link href="/history" className="flex items-center text-[var(--fg)]/60 hover:text-[var(--fg)]">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to History
                </Link>
                <div className="space-x-3">
                    {!edit ? (
                        <>
                            <button onClick={() => window.print()} className="inline-flex items-center px-4 py-2 border border-[var(--fg)]/20 rounded-md shadow-sm text-sm font-medium text-[var(--fg)] bg-[var(--bg)] hover:bg-[var(--fg)]/5">
                                <Printer className="w-4 h-4 mr-2" /> Print
                            </button>
                            <button onClick={() => setEdit(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--bg)] bg-[var(--fg)] hover:opacity-90">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Bill
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => {
                                setDraft(JSON.parse(JSON.stringify(bill)));
                                setEdit(false);
                            }} className="inline-flex items-center px-4 py-2 border border-[var(--fg)]/20 rounded-md shadow-sm text-sm font-medium text-[var(--fg)] bg-[var(--bg)] hover:bg-[var(--fg)]/5">
                                <X className="w-4 h-4 mr-2" /> Cancel
                            </button>
                            <button onClick={save} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--bg)] bg-[var(--fg)] hover:opacity-90">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Bill Container */}
            <div className="max-w-4xl mx-auto bg-[var(--bg)] shadow-xl rounded-lg overflow-hidden border border-[var(--fg)]/20 print:shadow-none print:border-none">

                {/* Header */}
                <div className="p-6 border-b border-[var(--fg)]/20">
                    <div className="flex justify-between items-start">
                        {/* Customer Info */}
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--fg)]">{bill.customerId.name}</h1>
                            <div className="text-sm text-[var(--fg)]/60 mt-1">{bill.customerId.email}</div>
                            <div className="text-sm text-[var(--fg)]/60">{bill.customerId.phone}</div>

                            <div className="mt-3 flex items-center gap-3">
                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${draft.paymentStatus === 'paid' ? 'bg-[var(--fg)] text-[var(--bg)]' :
                                    draft.paymentStatus === 'partial' ? 'bg-[var(--fg)]/20 text-[var(--fg)]' :
                                        'border border-[var(--fg)] text-[var(--fg)]'
                                    }`}>
                                    {edit ? (
                                        <select
                                            value={draft.paymentStatus}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                let newAmount = draft.partialPayment;
                                                if (newStatus === 'paid') newAmount = total;
                                                if (newStatus === 'unpaid') newAmount = 0;

                                                setDraft(d => ({
                                                    ...d,
                                                    paymentStatus: newStatus,
                                                    partialPayment: newAmount
                                                }));
                                            }}
                                            className="bg-transparent border-none outline-none cursor-pointer appearance-none pr-2 text-xs font-medium text-[var(--fg)]"
                                        >
                                            <option value="paid" className="text-black">PAID</option>
                                            <option value="partial" className="text-black">PARTIAL</option>
                                            <option value="unpaid" className="text-black">UNPAID</option>
                                        </select>
                                    ) : (
                                        draft.paymentStatus.toUpperCase()
                                    )}
                                </div>

                                <div className="text-xs text-[var(--fg)]/60">
                                    Balance: <span className="font-semibold text-[var(--fg)]">
                                        {formatCurrency(bill.customerId.balance)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="text-right text-sm">
                            <div className="text-[var(--fg)]/60">Date: <span className="font-medium text-[var(--fg)]">{formatDate(bill.createdAt)}</span></div>
                            <div className="text-[var(--fg)]/60 mt-1 text-xs">Updated: <span className="text-[var(--fg)]/80">{formatDate(bill.updatedAt)}</span></div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="p-6">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--fg)]/20 text-left text-xs font-semibold text-[var(--fg)]/60 uppercase tracking-wider">
                                <th className="pb-3 pl-2 w-[40%]">Item Description</th>
                                <th className="pb-3 text-right w-[20%]">Unit Price</th>
                                <th className="pb-3 text-right w-[15%]">Qty</th>
                                <th className="pb-3 text-right w-[25%]">Total</th>
                                {edit && <th className="pb-3 w-10"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--fg)]/10">
                            {draft.products.map((p, i) => (
                                <tr key={i} className="text-sm text-[var(--fg)]">
                                    <td className="py-3 pl-2 align-top">
                                        {edit ? (
                                            <SearchSelect
                                                options={allProducts}
                                                value={p.product}
                                                onChange={prod =>
                                                    updateRow(i, () => ({
                                                        product: { ...prod },
                                                        quantity: p.quantity
                                                    }))
                                                }
                                            />
                                        ) : (
                                            <div>
                                                <div className="font-medium">{p.product?.name}</div>
                                                <div className="text-[var(--fg)]/60 text-xs">{p.product?.desc}</div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 text-right align-top">
                                        {edit ? (
                                            <input
                                                type="number"
                                                value={p.product?.price || 0}
                                                onChange={e =>
                                                    updateRow(i, x => ({
                                                        ...x,
                                                        product: { ...x.product, price: +e.target.value }
                                                    }))
                                                }
                                                className="w-24 text-right border-b border-[var(--fg)]/20 focus:border-[var(--fg)] outline-none bg-transparent text-[var(--fg)]"
                                            />
                                        ) : (
                                            formatCurrency(p.product?.price || 0)
                                        )}
                                        <div className="text-xs text-[var(--fg)]/40 mt-1">per {p.product?.unit || 'unit'}</div>
                                    </td>
                                    <td className="py-3 text-right align-top">
                                        {edit ? (
                                            <input
                                                type="number"
                                                min="1"
                                                value={p.quantity}
                                                onChange={e =>
                                                    updateRow(i, x => ({
                                                        ...x,
                                                        quantity: +e.target.value
                                                    }))
                                                }
                                                className="w-16 text-right border-b border-[var(--fg)]/20 focus:border-[var(--fg)] outline-none bg-transparent text-[var(--fg)]"
                                            />
                                        ) : (
                                            p.quantity
                                        )}
                                    </td>
                                    <td className="py-3 text-right font-medium align-top">
                                        {formatCurrency((p.product?.price || 0) * p.quantity)}
                                    </td>
                                    {edit && (
                                        <td className="py-3 text-center align-top">
                                            <button onClick={() => removeItem(i)} className="text-[var(--fg)]/50 hover:text-[var(--fg)]">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {edit && (
                        <button onClick={addItem} className="mt-4 flex items-center text-[var(--fg)] hover:text-[var(--fg)]/70 text-sm font-medium">
                            <Plus className="w-4 h-4 mr-1" /> Add Item
                        </button>
                    )}
                </div>

                {/* Footer / Totals */}
                <div className="p-6 bg-[var(--bg)] border-t border-[var(--fg)]/20">
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between text-sm text-[var(--fg)]/60">
                                <span>Subtotal</span>
                                <span className="font-medium text-[var(--fg)]">{formatCurrency(subtotal)}</span>
                            </div>

                            <div className="flex justify-between text-sm text-[var(--fg)]/60 items-center">
                                <span>Discount</span>
                                <div className="flex items-center space-x-2">
                                    {edit ? (
                                        <>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={draft.discounts.percent}
                                                    onChange={e => setDraft(d => ({ ...d, discounts: { ...d.discounts, percent: +e.target.value } }))}
                                                    className="w-12 text-right border-b border-[var(--fg)]/20 focus:border-[var(--fg)] outline-none bg-transparent text-xs text-[var(--fg)]"
                                                />
                                                <span className="text-xs ml-1">%</span>
                                            </div>
                                            <span className="text-[var(--fg)]/40">+</span>
                                            <div className="flex items-center">
                                                <span className="text-xs mr-1">₹</span>
                                                <input
                                                    type="number"
                                                    value={draft.discounts.amount}
                                                    onChange={e => setDraft(d => ({ ...d, discounts: { ...d.discounts, amount: +e.target.value } }))}
                                                    className="w-16 text-right border-b border-[var(--fg)]/20 focus:border-[var(--fg)] outline-none bg-transparent text-xs text-[var(--fg)]"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <span>
                                            {draft.discounts.percent > 0 && `${draft.discounts.percent}% `}
                                            {draft.discounts.amount > 0 && `+ ₹${draft.discounts.amount}`}
                                            {draft.discounts.percent === 0 && draft.discounts.amount === 0 && "-"}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[var(--fg)]">- {formatCurrency(discountValue)}</span>
                            </div>

                            <div className="flex justify-between text-sm text-[var(--fg)]/60 items-center">
                                <span>Additional Fees</span>
                                {edit ? (
                                    <input
                                        type="number"
                                        value={draft.additionalFees}
                                        onChange={e => setDraft(d => ({ ...d, additionalFees: +e.target.value }))}
                                        className="w-20 text-right border-b border-[var(--fg)]/20 focus:border-[var(--fg)] outline-none bg-transparent text-[var(--fg)]"
                                    />
                                ) : (
                                    <span>{formatCurrency(draft.additionalFees)}</span>
                                )}
                            </div>

                            <div className="border-t border-[var(--fg)]/20 pt-3 flex justify-between items-center">
                                <span className="text-base font-bold text-[var(--fg)]">Total</span>
                                <span className="text-xl font-bold text-[var(--fg)]">{formatCurrency(total)}</span>
                            </div>

                            <div className="pt-4 space-y-2">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-[var(--fg)]/60">Amount Paid</span>
                                    {edit ? (
                                        <input
                                            type="number"
                                            value={draft.partialPayment}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setDraft(d => ({ ...d, partialPayment: val === "" ? "" : +val }))
                                            }}
                                            className="w-24 text-right border-b border-[var(--fg)]/20 focus:border-[var(--fg)] outline-none bg-transparent font-medium text-[var(--fg)]"
                                        />
                                    ) : (
                                        <span className="font-medium text-[var(--fg)]">{formatCurrency(draft.partialPayment)}</span>
                                    )}
                                </div>

                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-[var(--fg)]">Balance Due</span>
                                    <span className="text-[var(--fg)]">
                                        {formatCurrency(balanceDue)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
