import { NextRequest, NextResponse } from "next/server"
import { authMiddleware } from "@/middleware/auth"

export async function GET(req: NextRequest) {
    try {
        // Verify authentication
        const authResult = await authMiddleware(req)
        if (authResult instanceof NextResponse) {
            return authResult // Return error response
        }

        const { user } = authResult

        // Return user data
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Get user error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
