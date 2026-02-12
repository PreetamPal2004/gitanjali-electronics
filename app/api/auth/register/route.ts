import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/User"
import { registerSchema } from "@/lib/validations"
import { generateAccessToken, generateRefreshToken, setAuthCookies } from "@/lib/auth"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Validate input
        const validation = registerSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { name, email, password } = validation.data

        // Connect to database
        await connectDB()

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            )
        }

        // Create new user (password will be hashed by pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            role: "user",
        })

        // Generate tokens
        const accessToken = await generateAccessToken(user._id.toString(), user.email)
        const refreshToken = await generateRefreshToken(user._id.toString())

        // Save refresh token to database
        user.refreshToken = refreshToken
        await user.save()

        // Set HTTP-only cookies
        await setAuthCookies(accessToken, refreshToken)

        // Return user info (without password)
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 201 }
        )
    } catch (error: any) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
