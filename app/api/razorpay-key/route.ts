import { NextResponse } from "next/server"

export async function GET() {
    const key_id = process.env.RAZORPAY_KEY_ID

    if (!key_id) {
        return NextResponse.json(
            { error: "Razorpay key not configured" },
            { status: 500 }
        )
    }

    return NextResponse.json({ key_id })
}
