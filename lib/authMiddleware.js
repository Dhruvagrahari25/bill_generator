import { NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function getUserFromHeader(headers) {
    const authHeader = headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    return decoded.userId;
}
