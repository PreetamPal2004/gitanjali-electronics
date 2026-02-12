import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Cart from "@/models/Cart"
import { authMiddleware } from "@/middleware/auth"
import { updateCartSchema } from "@/lib/validations"

export async function PUT(req: NextRequest) {
    try {
        // Verify authentication
        const authResult = await authMiddleware(req)
        if (authResult instanceof NextResponse) {
            return authResult
        }

        const { userId } = authResult
        const body = await req.json()

        // Validate input
        const validation = updateCartSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { productId, quantity } = validation.data

        // Connect to database
        await connectDB()

        // Find cart
        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 }
            )
        }

        // Find product in cart
        const productIndex = cart.products.findIndex(
            (item: any) => item.productId === productId
        )

        if (productIndex === -1) {
            return NextResponse.json(
                { error: "Product not found in cart" },
                { status: 404 }
            )
        }

        // Update quantity
        cart.products[productIndex].quantity = quantity

        // Save cart (totals will be recalculated)
        await cart.save()

        return NextResponse.json(
            {
                success: true,
                cart: {
                    products: cart.products,
                    totalPrice: cart.totalPrice,
                },
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("Update cart error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
