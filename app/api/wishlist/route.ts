import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Wishlist from "@/models/Wishlist"
import { authMiddleware } from "@/middleware/auth"

export async function GET(req: NextRequest) {
    try {
        const authResult = await authMiddleware(req)
        if (authResult instanceof NextResponse) {
            // Allow guests to just have empty response or handle via 401?
            // Actually, if auth fails, we probably just want to return 401 so frontend knows to use local storage?
            // But the previous cart implementation returned NextResponse which is likely a 401. 
            return authResult
        }

        const { userId } = authResult

        await connectDB()

        let wishlist = await Wishlist.findOne({ user: userId })

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                products: [],
            })
        }

        return NextResponse.json(
            {
                success: true,
                wishlist: {
                    products: wishlist.products,
                },
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Get wishlist error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
