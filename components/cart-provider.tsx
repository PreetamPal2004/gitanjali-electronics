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
import { toast } from "sonner"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated, isHydrated } = useAuthStore()

  /* =========================
     LOAD CART (Safe Version)
  ========================== */
  useEffect(() => {
    if (!isHydrated) return

    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/cart", { cache: "no-store" })
          if (!res.ok) return

          const data = await res.json()

          const mapped: CartItem[] = data.cart.products
            .map((item: any) => {
              const product = getProduct(item.productId)
              if (!product) return null

              return {
                product,
                quantity: Number(item.quantity) || 1,
              }
            })
            .filter(Boolean)

          setItems(mapped)

          // 🔥 IMPORTANT: Clear guest cart after login
          localStorage.removeItem("volt-cart")
        } catch (err) {
          console.error("DB cart load failed", err)
          toast.error("Failed to load your cart")
        }
      } else {
        const saved = localStorage.getItem("volt-cart")
        if (saved) {
          try {
            setItems(JSON.parse(saved))
          } catch {
            console.error("Corrupted guest cart")
          }
        }
      }
    }

    loadCart()
  }, [isAuthenticated, isHydrated])

  /* =========================
     SAVE GUEST CART ONLY
  ========================== */
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("volt-cart", JSON.stringify(items))
    }
  }, [items, isAuthenticated])

  /* =========================
     ADD ITEM
  ========================== */
  const addItem = useCallback(
    async (product: Product) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.product.id === product.id
        )

        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }

        return [...prev, { product, quantity: 1 }]
      })

      if (isAuthenticated) {
        try {
          const res = await fetch("/api/cart/add", {
            method: "POST",
            body: JSON.stringify({
              productId: product.id,
              quantity: 1,
              priceAtTime: product.price,
            }),
          })

          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || "Failed to add to cart")
          }
        } catch (error: any) {
          console.error("Add to cart failed", error)
          toast.error(error.message || "Failed to sync with server")
        }
      }
    },
    [isAuthenticated]
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
          const res = await fetch(`/api/cart/remove/${productId}`, {
            method: "DELETE",
          })

          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || "Failed to remove from cart")
          }
        } catch (error: any) {
          console.error("Remove from cart failed", error)
          toast.error(error.message || "Failed to remove item")
        }
      }
    },
    [isAuthenticated]
  )

  /* =========================
     UPDATE QUANTITY
  ========================== */
  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId)
        return
      }

      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId
            ? { ...i, quantity }
            : i
        )
      )

      if (isAuthenticated) {
        try {
          const res = await fetch("/api/cart/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
          })

          if (!res.ok) {
            const error = await res.json()
            throw new Error(error.error || "Failed to update cart")
          }
        } catch (error: any) {
          console.error("Update quantity failed", error)
          toast.error(error.message || "Failed to update quantity")
        }
      }
    },
    [isAuthenticated, removeItem]
  )

  const clearCart = useCallback(async () => {
    setItems([])

    if (isAuthenticated) {
      await fetch("/api/cart/clear", {
        method: "DELETE",
      })
    }
  }, [isAuthenticated])

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
