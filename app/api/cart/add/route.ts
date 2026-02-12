import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Cart from "@/models/Cart"
import { authMiddleware } from "@/middleware/auth"
import { cartItemSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const authResult = await authMiddleware(req)
        if (authResult instanceof NextResponse) {
            return authResult
        }

        const { userId } = authResult
        const body = await req.json()

        // Validate input
        const validation = cartItemSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { productId, quantity, priceAtTime } = validation.data

        // Connect to database
        await connectDB()

        // Find or create cart
        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            cart = await Cart.create({
                user: userId,
                products: [],
                totalPrice: 0,
            })
        }

        // Check if product already exists in cart - convert to string for safety
        const existingProductIndex = cart.products.findIndex(
            (item: any) => String(item.productId) === String(productId)
        )

        if (existingProductIndex > -1) {
            // Update quantity
            cart.products[existingProductIndex].quantity += quantity
            // Optimization: If duplicates exist, merge them (though unlikely if logic holds)
        } else {
            // Add new product
            cart.products.push({
                productId,
                quantity,
                priceAtTime,
            })
        }

        // Remove strictly empty items if any
        cart.products = cart.products.filter((p: any) => p.quantity > 0);

        // Save cart (totals will be recalculated by pre-save hook)
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
        console.error("Add to cart error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
