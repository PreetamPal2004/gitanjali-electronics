"use client"

import { useWishlist } from "@/components/wishlist-provider"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"

export default function WishlistPage() {
    const { items } = useWishlist()

    if (items.length === 0) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Your wishlist is empty
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Save items you want to buy later by clicking the heart icon.
                </p>
                <Link
                    href="/shop"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="container px-4 py-8 md:px-6 lg:py-12 mx-auto">
            <div className="mb-8 items-center justify-between gap-4 sm:flex">
                <h1 className="text-3xl font-serif text-foreground">My Wishlist</h1>
                <p className="text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {items.map((item) => (
                    <ProductCard key={item.product.id} product={item.product} />
                ))}
            </div>
        </div>
    )
}
