"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useCartStore } from "@/lib/stores/cart-store"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const login = useAuthStore((state) => state.login)
    const { items: localCartItems, syncWithDB } = useCartStore()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Convert local cart to API format (safely handle items without product)
            const localCart = (localCartItems || [])
                .filter((item) => item?.product?.id)
                .map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    priceAtTime: item.product.price ?? 0,
                }))

            const result = await login(email, password, localCart)

            if (result.success) {
                toast.success("Logged in successfully!")

                // Sync cart from database
                try {
                    await syncWithDB()
                } catch {
                    // Non-blocking if sync fails
                }

                onSuccess?.()
                router.push("/")
            } else {
                toast.error(result.error || "Login failed")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging in...
                    </>
                ) : (
                    "Log In"
                )}
            </button>
        </form>
    )
}
