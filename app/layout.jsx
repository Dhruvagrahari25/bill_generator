import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import { Metadata } from 'next';

export const metadata = {
    title: 'BillGen - Online Invoicing Tool',
    description: 'Create and manage invoices easily with BillGen, the online invoicing tool designed for small businesses and freelancers.',
};

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
