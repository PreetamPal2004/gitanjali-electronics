import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { clearAuthCookies } from "@/lib/auth"
import { authMiddleware } from "@/middleware/auth"

export async function POST(req: NextRequest) {
    try {
        // Verify user is authenticated
        const authResult = await authMiddleware(req)
        if (authResult instanceof NextResponse) {
            return authResult // Return error response
        }

        const { userId } = authResult

        // Connect to database
        await connectDB()

        // Clear refresh token from database
        await User.findByIdAndUpdate(userId, { refreshToken: null })

        // Clear cookies
        await clearAuthCookies()

        return NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Logout error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
