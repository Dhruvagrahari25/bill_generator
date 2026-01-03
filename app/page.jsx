export default function Home() {
    return (
        <main className="min-h-screen grid grid-cols-2">

            {/* Left */}
            <section className="flex flex-col justify-center px-16">
                <h1 className="text-5xl font-semibold mb-6"> Online</h1>
                <h1 className="text-5xl font-semibold mb-6"> Bill</h1>
                <h1 className="text-5xl font-semibold mb-6"> Generator</h1>

                <div className="flex gap-4">
                    <a
                        href="/login"
                        className="px-6 py-3 border border-fg hover:bg-fg hover:text-bg transition"
                    >
                        Login
                    </a>
                    <a
                        href="/signup"
                        className="px-6 py-3 border border-fg/40 hover:border-fg transition"
                    >
                        Sign Up
                    </a>
                </div>
            </section>

            {/* Right */}
            <section className="flex items-center justify-center">
                <img
                    src="/images/bill.jpg"
                    alt="Bill preview"
                    className="max-w-md"
                />
            </section>

        </main>
    );
}
