"use client"

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react"
import { type Product, getProduct } from "@/lib/products"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useToast } from "@/hooks/use-toast"

export interface WishlistItem {
    product: Product
    addedAt: Date
}

interface WishlistContextValue {
    items: WishlistItem[]
    addItem: (product: Product) => void
    removeItem: (productId: string) => void
    isInWishlist: (productId: string) => boolean
    clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([])
    const { isAuthenticated, isHydrated } = useAuthStore()
    const { toast } = useToast()

    /* =========================
       LOAD WISHLIST (Safe Version)
    ========================== */
    useEffect(() => {
        if (!isHydrated) return

        const loadWishlist = async () => {
            if (isAuthenticated) {
                try {
                    const res = await fetch("/api/wishlist", { cache: "no-store" })
                    if (!res.ok) return

                    const data = await res.json()

                    // Map API items to local WishlistItem format (fetching product details)
                    const mapped: WishlistItem[] = data.wishlist.products
                        .map((item: any) => {
                            const product = getProduct(item.productId)
                            if (!product) return null

                            return {
                                product,
                                addedAt: new Date(item.addedAt),
                            }
                        })
                        .filter(Boolean)

                    // If we have local items, we might want to merge them?
                    // Simple strategy: Just use DB version, but if local version exists and DB is empty, maybe sync?
                    // For now, let's just stick to "DB is truth if logged in" but we can do a one-time sync if we want.
                    // Actually, let's do the sync logic:
                    // If there are items in local storage, add them to DB (if not already there).

                    const saved = localStorage.getItem("volt-wishlist")
                    if (saved) {
                        const localItems: WishlistItem[] = JSON.parse(saved)
                        // We will just process them in background to add to DB
                        for (const localItem of localItems) {
                            const exists = mapped.find(i => i.product.id === localItem.product.id)
                            if (!exists) {
                                // Add to DB
                                try {
                                    await fetch("/api/wishlist/add", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ productId: localItem.product.id })
                                    })
                                    // Add to mapped list for immediate UI update
                                    mapped.push(localItem)
                                } catch (err) {
                                    console.error("Failed to sync local wishlist item", err)
                                }
                            }
                        }
                        // Clear local storage after sync attempt
                        localStorage.removeItem("volt-wishlist")
                    }

                    setItems(mapped)
                } catch (err) {
                    console.error("DB wishlist load failed", err)
                }
            } else {
                const saved = localStorage.getItem("volt-wishlist")
                if (saved) {
                    try {
                        setItems(JSON.parse(saved))
                    } catch {
                        console.error("Corrupted guest wishlist")
                    }
                }
            }
        }

        loadWishlist()
    }, [isAuthenticated, isHydrated])

    /* =========================
       SAVE GUEST WISHLIST ONLY
    ========================== */
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem("volt-wishlist", JSON.stringify(items))
        }
    }, [items, isAuthenticated])

    /* =========================
       ADD ITEM
    ========================== */
    const addItem = useCallback(
        async (product: Product) => {
            // Optimistic Update
            let alreadyExists = false
            setItems((prev) => {
                if (prev.find((i) => i.product.id === product.id)) {
                    alreadyExists = true
                    return prev
                }
                return [...prev, { product, addedAt: new Date() }]
            })

            if (alreadyExists) return

            toast({
                title: "Added to wishlist",
                description: `${product.name} has been added to your wishlist.`,
            })

            if (isAuthenticated) {
                try {
                    await fetch("/api/wishlist/add", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            productId: product.id,
                        }),
                    })
                } catch (err) {
                    console.error("Failed to add to wishlist DB", err)
                    // Revert on failure? For now, keep optimistic.
                }
            }
        },
        [isAuthenticated, toast]
    )

    /* =========================
       REMOVE ITEM
    ========================== */
    const removeItem = useCallback(
        async (productId: string) => {
            setItems((prev) =>
                prev.filter((i) => i.product.id !== productId)
            )

            if (isAuthenticated) {
                try {
                    const res = await fetch(`/api/wishlist/remove/${productId}`, {
                        method: "DELETE",
                    })
                    if (!res.ok) {
                        const error = await res.json()
                        throw new Error(error.error || "Failed to remove from wishlist")
                    }
                } catch (err: any) {
                    console.error("Failed to remove from wishlist DB", err)
                    toast({
                        title: "Error",
                        description: err.message || "Failed to remove item",
                        variant: "destructive"
                    })
                    // Revert optimistic update
                    setItems((prev) => [...prev]) // This is tricky without the original item.
                    // Better: invalidate and refetch, or just alert.
                    // For now, alerting is good.
                }
            }
        },
        [isAuthenticated]
    )

    const clearWishlist = useCallback(() => {
        setItems([])
        if (!isAuthenticated) {
            localStorage.removeItem("volt-wishlist")
        }
        // No clear all API implemented yet, but we could if needed.
    }, [isAuthenticated])

    const isInWishlist = useCallback((productId: string) => {
        return items.some(item => item.product.id === productId)
    }, [items])

    return (
        <WishlistContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                isInWishlist,
                clearWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error("useWishlist must be used within WishlistProvider")
    }
    return context
}
