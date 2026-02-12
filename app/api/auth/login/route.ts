import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import Cart from "@/models/Cart"
import { loginSchema } from "@/lib/validations"
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password, localCart } = body

    await connectDB()

    // Find user
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate tokens
    const accessToken = await generateAccessToken(
      user._id.toString(),
      user.email
    )
    const refreshToken = await generateRefreshToken(
      user._id.toString()
    )

    user.refreshToken = refreshToken
    await user.save()

    await setAuthCookies(accessToken, refreshToken)

    // Get or create cart
    let cart = await Cart.findOne({ user: user._id })

    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        products: [],
        totalPrice: 0,
      })
    }

    /*
      🔥 FIXED MERGE LOGIC
      Only merge guest cart if DB cart is empty.
      Prevents repeated duplication on relogin.
    */
    if (
      localCart &&
      Array.isArray(localCart) &&
      localCart.length > 0 &&
      cart.products.length === 0
    ) {
      cart.products = localCart.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: item.priceAtTime || item.price || 0,
      }))

      await cart.save()
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        cart: {
          products: cart.products,
          totalPrice: cart.totalPrice,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
