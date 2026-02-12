"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export function CartContent() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-lg font-medium text-foreground">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Looks like you haven{"'"}t added any products yet.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Browse Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="flex flex-col gap-0">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-5 border-b border-border py-6 first:pt-0"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {item.product.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.product.category}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="mt-6 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          Clear Cart
        </button>
      </div>

      <div className="lg:col-span-1">
        <div className="rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Order Summary
          </h2>

          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">
                {totalPrice >= 100 ? "Free" : "$12.00"}
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Total
              </span>
              <span className="text-lg font-bold text-foreground">
                ${(totalPrice >= 100 ? totalPrice : totalPrice + 12).toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Checkout
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Free shipping on orders over $100
          </p>
        </div>
      </div>
    </div>
  )
}
