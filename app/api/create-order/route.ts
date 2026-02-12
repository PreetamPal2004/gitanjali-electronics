import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

const key_id = process.env.RAZORPAY_KEY_ID as string
const key_secret = process.env.RAZORPAY_KEY_SECRET as string

export async function POST(request: NextRequest) {
  try {
    if (!key_id || !key_secret) {
      return NextResponse.json(
        { message: "Razorpay keys are not configured" },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({ key_id, key_secret })

    const { amount, currency } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "A valid amount is required" },
        { status: 400 }
      )
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || "INR",
      receipt: `volt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json({ orderId: order.id }, { status: 200 })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    )
  }
}
