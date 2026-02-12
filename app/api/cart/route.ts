import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Cart from "@/models/Cart"
import { authMiddleware } from "@/middleware/auth"

export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { userId } = authResult

    await connectDB()

    let cart = await Cart.findOne({ user: userId })

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [],
        totalPrice: 0,
      })
    }

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
    console.error("Get cart error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
