export default function Home() {
    return (
        <div className="min-h-[calc(100vh-80px)] grid grid-cols-1 md:grid-cols-2">

            {/* Left */}
            <section className="flex flex-col justify-center px-6 md:px-16 order-2 md:order-1 pb-12 md:pb-0">
                <h1 className="text-4xl md:text-5xl font-semibold mb-4 md:mb-6"> Online</h1>
                <h1 className="text-4xl md:text-5xl font-semibold mb-4 md:mb-6"> Bill</h1>
                <h1 className="text-4xl md:text-5xl font-semibold mb-4 md:mb-6"> Generator</h1>

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
            <section className="flex items-center justify-center p-8 md:p-0 order-1 md:order-2">
                <img
                    src="/images/bill.jpg"
                    alt="Bill preview"
                    className="w-full max-w-sm md:max-w-md object-contain"
                />
            </section>

        </div>
    );
}
