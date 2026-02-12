import { NextRequest, NextResponse } from "next/server"
import { verifyToken, getTokenFromCookies } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import User from "@/models/User"

export interface AuthRequest extends NextRequest {
    userId?: string
    user?: any
}

export async function authMiddleware(req: NextRequest) {
    try {
        // Get access token from cookies
        const token = await getTokenFromCookies("access")
        console.log("DEBUG: Auth middleware token present:", !!token)

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized - No token provided" },
                { status: 401 }
            )
        }

        // Verify token
        const payload = await verifyToken(token)

        if (!payload || payload.type !== "access") {
            return NextResponse.json(
                { error: "Unauthorized - Invalid token" },
                { status: 401 }
            )
        }

        // Connect to DB and fetch user
        await connectDB()
        const user = await User.findById(payload.userId).select("-password")
        console.log("DEBUG: Auth middleware user found:", !!user, payload.userId)

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized - User not found" },
                { status: 401 }
            )
        }

        // Attach user to request headers for use in route handlers
        const requestHeaders = new Headers(req.headers)
        requestHeaders.set("x-user-id", user._id.toString())
        requestHeaders.set("x-user-email", user.email)

        return {
            userId: user._id.toString(),
            user,
            headers: requestHeaders,
        }
    } catch (error) {
        console.error("Auth middleware error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// Helper to extract user from request headers
export function getUserFromHeaders(req: NextRequest) {
    return {
        userId: req.headers.get("x-user-id"),
        email: req.headers.get("x-user-email"),
    }
}
