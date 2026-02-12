import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Wishlist from "@/models/Wishlist"
import { authMiddleware } from "@/middleware/auth"

export async function POST(req: NextRequest) {
    try {
        const authResult = await authMiddleware(req)
        if (authResult instanceof NextResponse) {
            return authResult
        }

        const { userId } = authResult
        const { productId } = await req.json()

        if (!productId) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            )
        }

        await connectDB()

        let wishlist = await Wishlist.findOne({ user: userId })

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                products: [{ productId, addedAt: new Date() }],
            })
        } else {
            // Check if product exists
            const exists = wishlist.products.find(
                (p: any) => p.productId === productId
            )

            if (!exists) {
                wishlist.products.push({ productId, addedAt: new Date() })
                await wishlist.save()
            }
        }

        return NextResponse.json(
            { success: true, wishlist },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Add to wishlist error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
