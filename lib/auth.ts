import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-key-minimum-32-chars"
)

const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "15m"
const REFRESH_TOKEN_EXPIRE = process.env.REFRESH_TOKEN_EXPIRE || "7d"

// Convert time strings to seconds
function parseExpiration(expire: string): number {
    const unit = expire.slice(-1)
    const value = parseInt(expire.slice(0, -1))

    switch (unit) {
        case "s":
            return value
        case "m":
            return value * 60
        case "h":
            return value * 60 * 60
        case "d":
            return value * 60 * 60 * 24
        default:
            return 900 // 15 minutes default
    }
}

export async function generateAccessToken(userId: string, email: string) {
    const exp = parseExpiration(ACCESS_TOKEN_EXPIRE)

    return await new SignJWT({ userId, email, type: "access" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + exp)
        .sign(JWT_SECRET)
}

export async function generateRefreshToken(userId: string) {
    const exp = parseExpiration(REFRESH_TOKEN_EXPIRE)

    return await new SignJWT({ userId, type: "refresh" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(Math.floor(Date.now() / 1000) + exp)
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload
    } catch (error) {
        return null
    }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
    const cookieStore = await cookies()
    const isProduction = false // process.env.NODE_ENV === "production"
    console.log("DEBUG: Force setting secure: false for testing")

    cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: parseExpiration(ACCESS_TOKEN_EXPIRE),
        path: "/",
    })

    cookieStore.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: parseExpiration(REFRESH_TOKEN_EXPIRE),
        path: "/",
    })
}

export async function clearAuthCookies() {
    const cookieStore = await cookies()

    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")
}

export async function getTokenFromCookies(
    type: "access" | "refresh" = "access"
): Promise<string | null> {
    const cookieStore = await cookies()
    console.log("DEBUG: Retrieving cookies (all):", cookieStore.getAll().map(c => c.name))
    const cookieName = type === "access" ? "accessToken" : "refreshToken"
    const cookie = cookieStore.get(cookieName)

    return cookie?.value || null
}
