import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required parameters", success: false },
        { status: 400 }
      )
    }

    const secret = process.env.RAZORPAY_KEY_SECRET as string
    if (!secret) {
      return NextResponse.json(
        { error: "Razorpay secret not configured", success: false },
        { status: 500 }
      )
    }

    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`)
    const generatedSignature = hmac.digest("hex")

    if (generatedSignature === razorpay_signature) {
      return NextResponse.json({
        message: "Payment verified successfully",
        success: true,
      })
    } else {
      return NextResponse.json(
        { error: "Invalid payment signature", success: false },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { error: "Verification failed", success: false },
      { status: 500 }
    )
  }
}
