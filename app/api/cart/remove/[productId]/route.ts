import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Cart from "@/models/Cart"
import { authMiddleware } from "@/middleware/auth"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    // Verify authentication
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { userId } = authResult
    const { productId } = await params

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    await connectDB()

    const cart = await Cart.findOne({ user: userId })
    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      )
    }

    // ✅ Safe comparison
    cart.products = cart.products.filter(
      (item: any) =>
        String(item.productId) !== String(productId)
    )

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
    console.error("Remove from cart error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
