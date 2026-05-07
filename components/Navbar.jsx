"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LogoutButton from "@/components/logoutBtn";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = () => {
            const token = document.cookie.split('; ').find(row => row.startsWith('token='));
            setIsLoggedIn(!!token);
        };
        checkAuth();
    }, [pathname]);

    return (
        <nav className="border-b border-fg/10 relative z-50" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
            <div className="flex justify-between items-center px-6 py-4">
                <div className="font-bold text-lg">
                    <Link href="/">BillGen</Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm">
                    <Link href="/">HOME</Link>
                    <Link href="/products">PRODUCTS</Link>
                    <Link href="/customers">CUSTOMERS</Link>
                    <Link href="/history">HISTORY</Link>
                    <Link href="/create-new-bill">CREATE NEW BILL</Link>
                    {isLoggedIn && <LogoutButton />}
                    <ThemeToggle />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 border-b border-fg/10 p-4 flex flex-col gap-4 shadow-lg z-50" style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}>
                    <Link href="/" onClick={() => setIsOpen(false)}>HOME</Link>
                    <Link href="/products" onClick={() => setIsOpen(false)}>PRODUCTS</Link>
                    <Link href="/customers" onClick={() => setIsOpen(false)}>CUSTOMERS</Link>
                    <Link href="/history" onClick={() => setIsOpen(false)}>HISTORY</Link>
                    <Link href="/create-new-bill" onClick={() => setIsOpen(false)}>CREATE NEW BILL</Link>
                    {isLoggedIn && (
                        <div className="pt-2 border-t border-fg/10">
                            <LogoutButton />
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
