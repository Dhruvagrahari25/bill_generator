"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({});
    const [error, setError] = useState("");

    function update(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function submit(e) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (!res.ok) return setError(data.error);

        router.push("/login");
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={submit}
                className="w-full max-w-sm border border-fg/20 p-6 space-y-3"
            >
                <h1 className="text-2xl font-semibold text-center">Sign Up</h1>

                <input placeholder="Name" required
                       className="w-full px-3 py-2 border border-fg/30 bg-transparent outline-none" onChange={e=>update("name",e.target.value)} />

                <input placeholder="Email" type="email" required
                       className="w-full px-3 py-2 border border-fg/30 bg-transparent outline-none" onChange={e=>update("email",e.target.value)} />

                <input placeholder="Phone"
                       className="w-full px-3 py-2 border border-fg/30 bg-transparent outline-none" onChange={e=>update("phone",e.target.value)} />

                <input placeholder="Business Name"
                       className="w-full px-3 py-2 border border-fg/30 bg-transparent outline-none" onChange={e=>update("businessName",e.target.value)} />

                <input placeholder="Shop Address"
                       className="w-full px-3 py-2 border border-fg/30 bg-transparent outline-none" onChange={e=>update("shopAddress",e.target.value)} />

                <input placeholder="Password" type="password" required
                       className="w-full px-3 py-2 border border-fg/30 bg-transparent outline-none" onChange={e=>update("password",e.target.value)} />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button className="w-full py-2 border border-fg hover:bg-fg hover:text-bg transition">
                    Create Account
                </button>

                <p className="text-xs text-center text-fg/60">
                    Already have an account? <a href="/login" className="underline">Login</a>
                </p>
            </form>
        </main>
    );
}
