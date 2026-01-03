"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function submit(e) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) return setError(data.error);

        document.cookie = `token=${data.token}; path=/`;
        router.push("/products");
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={submit}
                className="w-full max-w-sm border border-fg/20 p-6 space-y-4"
            >
                <h1 className="text-2xl font-semibold text-center">Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-3 py-2 border border-fg/30 bg-transparent"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full px-3 py-2 border border-fg/30 bg-transparent"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button className="w-full py-2 border border-fg hover:bg-fg hover:text-bg transition">
                    Login
                </button>

                <p className="text-xs text-center text-fg/60">
                    New here? <a href="/signup" className="underline">Sign up</a>
                </p>
            </form>
        </main>
    );
}
