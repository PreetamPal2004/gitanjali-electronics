import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Wishlist from "@/models/Wishlist"
import { authMiddleware } from "@/middleware/auth"

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authResult = await authMiddleware(req)
        if (authResult instanceof NextResponse) {
            return authResult
        }

        const { userId } = authResult
        console.log("DEBUG: Remove from wishlist request from user:", userId)
        const { id } = await params
        const productId = id
        console.log("DEBUG: Remove from wishlist productId:", productId)

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            )
        }

        await connectDB()

        const wishlist = await Wishlist.findOne({ user: userId })

        if (wishlist) {
            wishlist.products = wishlist.products.filter(
                (p: any) => p.productId !== productId
            )
            const saved = await wishlist.save()
            console.log("DEBUG: Wishlist saved. Items remaining:", saved.products.length)
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Remove from wishlist error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
