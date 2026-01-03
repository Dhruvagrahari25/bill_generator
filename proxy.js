import { NextResponse } from "next/server";

export function proxy(req) {
    const token = req.cookies.get("token")?.value;

    const protectedRoutes = ["/products", "/customers", "/history"];

    if (
        protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path)) &&
        !token
    ) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/products/:path*", "/customers/:path*", "/history/:path*"],
};
