"use client";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/logoutBtn";

export default function Navbar() {
    return (
        <nav className="flex justify-between items-center px-6 py-4 border-b border-fg/10">
            <div className="font-bold text-lg">
                <Link href="/">BillGen</Link>
            </div>

            <div className="flex gap-28 text-sm">
                <Link href="/">Home</Link>
                <Link href="/products">PRODUCTS</Link>
                <Link href="/customers">CUSTOMERS</Link>
                <Link href="/history">HISTORY</Link>
                <Link href="/create-new-bill">CREATE NEW BILL</Link>
            </div>
            <LogoutButton/>
            <ThemeToggle/>
        </nav>
    );
}
