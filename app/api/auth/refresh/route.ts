import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import {
    verifyToken,
    generateAccessToken,
    getTokenFromCookies,
    setAuthCookies,
} from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        // Get refresh token from cookies
        const refreshToken = await getTokenFromCookies("refresh")

        if (!refreshToken) {
            return NextResponse.json(
                { error: "No refresh token provided" },
                { status: 401 }
            )
        }

        // Verify refresh token
        const payload = await verifyToken(refreshToken)

        if (!payload || payload.type !== "refresh") {
            return NextResponse.json(
                { error: "Invalid refresh token" },
                { status: 401 }
            )
        }

        // Connect to database
        await connectDB()

        // Verify refresh token matches database
        const user = await User.findById(payload.userId).select("+refreshToken")

        if (!user || user.refreshToken !== refreshToken) {
            return NextResponse.json(
                { error: "Invalid refresh token" },
                { status: 401 }
            )
        }

        // Generate new access token
        const newAccessToken = await generateAccessToken(
            user._id.toString(),
            user.email
        )

        // Update access token cookie (keep refresh token the same)
        await setAuthCookies(newAccessToken, refreshToken)

        return NextResponse.json(
            { success: true, message: "Token refreshed successfully" },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Refresh token error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
