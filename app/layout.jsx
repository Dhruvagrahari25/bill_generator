import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className="flex flex-col min-h-screen bg-bg text-fg">
        <Providers>
            <Navbar />
            <main className="flex-grow">{children}</main>
        </Providers>
        </body>
        </html>
    );
}
