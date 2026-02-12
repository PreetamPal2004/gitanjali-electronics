import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/products"

interface CartItem {
    product: Product
    quantity: number
}

interface CartStore {
    items: CartItem[]
    totalItems: number
    totalPrice: number

    // Actions
    addItem: (product: Product, isAuthenticated: boolean) => Promise<void>
    removeItem: (productId: string, isAuthenticated: boolean) => Promise<void>
    updateQuantity: (productId: string, quantity: number, isAuthenticated: boolean) => Promise<void>
    clearCart: () => void
    syncWithDB: () => Promise<void>
    setItems: (items: CartItem[]) => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,

            addItem: async (product, isAuthenticated) => {
                if (isAuthenticated) {
                    // Add to database
                    try {
                        const response = await fetch("/api/cart/add", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                productId: product.id,
                                quantity: 1,
                                priceAtTime: product.price,
                            }),
                        })

                        if (response.ok) {
                            const data = await response.json()
                            // Convert DB format to local format
                            const items = data.cart.products.map((item: any) => ({
                                product: { ...product, id: item.productId, price: item.priceAtTime },
                                quantity: item.quantity,
                            }))

                            set({
                                items,
                                totalPrice: data.cart.totalPrice,
                                totalItems: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
                            })
                        }
                    } catch (error) {
                        console.error("Add to cart error:", error)
                    }
                } else {
                    // Add to local storage
                    const { items } = get()
                    const existing = items.find((item) => item.product.id === product.id)

                    if (existing) {
                        set({
                            items: items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        })
                    } else {
                        set({ items: [...items, { product, quantity: 1 }] })
                    }

                    // Recalculate totals
                    const newItems = get().items
                    set({
                        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                        totalPrice: newItems.reduce(
                            (sum, item) => sum + item.product.price * item.quantity,
                            0
                        ),
                    })
                }
            },

            removeItem: async (productId, isAuthenticated) => {
                if (isAuthenticated) {
                    try {
                        const response = await fetch(`/api/cart/remove/${productId}`, {
                            method: "DELETE",
                        })

                        if (response.ok) {
                            const data = await response.json()
                            set({
                                items: data.cart.products.map((item: any) => ({
                                    product: { id: item.productId, price: item.priceAtTime },
                                    quantity: item.quantity,
                                })),
                                totalPrice: data.cart.totalPrice,
                                totalItems: data.cart.products.reduce((sum: number, item: any) => sum + item.quantity, 0),
                            })
                        }
                    } catch (error) {
                        console.error("Remove from cart error:", error)
                    }
                } else {
                    set({ items: get().items.filter((item) => item.product.id !== productId) })

                    const newItems = get().items
                    set({
                        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                        totalPrice: newItems.reduce(
                            (sum, item) => sum + item.product.price * item.quantity,
                            0
                        ),
                    })
                }
            },

            updateQuantity: async (productId, quantity, isAuthenticated) => {
                if (quantity <= 0) {
                    return get().removeItem(productId, isAuthenticated)
                }

                if (isAuthenticated) {
                    try {
                        const response = await fetch("/api/cart/update", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ productId, quantity }),
                        })

                        if (response.ok) {
                            const data = await response.json()
                            set({
                                items: data.cart.products.map((item: any) => ({
                                    product: { id: item.productId, price: item.priceAtTime },
                                    quantity: item.quantity,
                                })),
                                totalPrice: data.cart.totalPrice,
                                totalItems: data.cart.products.reduce((sum: number, item: any) => sum + item.quantity, 0),
                            })
                        }
                    } catch (error) {
                        console.error("Update cart error:", error)
                    }
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.product.id === productId ? { ...item, quantity } : item
                        ),
                    })

                    const newItems = get().items
                    set({
                        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
                        totalPrice: newItems.reduce(
                            (sum, item) => sum + item.product.price * item.quantity,
                            0
                        ),
                    })
                }
            },

            clearCart: () => {
                set({ items: [], totalItems: 0, totalPrice: 0 })
            },

            syncWithDB: async () => {
                try {
                    const response = await fetch("/api/cart")
                    if (response.ok) {
                        const data = await response.json()
                        // Convert DB format to local format
                        // Note: This is simplified - in production you'd fetch full product details
                        const items = data.cart.products.map((item: any) => ({
                            product: { id: item.productId, price: item.priceAtTime },
                            quantity: item.quantity,
                        }))

                        set({
                            items,
                            totalPrice: data.cart.totalPrice,
                            totalItems: items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
                        })
                    }
                } catch (error) {
                    console.error("Sync cart error:", error)
                }
            },

            setItems: (items) => {
                set({
                    items,
                    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
                    totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
                })
            },
        }),
        {
            name: "cart-storage",
        }
    )
)
