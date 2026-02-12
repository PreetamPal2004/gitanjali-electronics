"use client"

import React from "react"

import Image from "next/image"
import { Plus } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/products"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            "absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
            added
              ? "bg-accent text-accent-foreground scale-110"
              : "bg-foreground text-background hover:bg-accent hover:text-accent-foreground"
          )}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            {product.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {product.category}
          </p>
        </div>
        <p className="text-sm font-semibold text-foreground">
          ${product.price}
        </p>
      </div>
    </div>
  )
}
