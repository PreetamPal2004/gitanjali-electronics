import { Suspense } from "react"
import { ShopContent } from "@/components/shop/shop-content"

export const metadata = {
  title: "Shop - Volt Electronics",
  description:
    "Browse our curated collection of premium electronics. Headphones, smartwatches, speakers, keyboards, and more.",
}

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Our Collection
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Shop All Products
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Every product in our catalog has been hand-selected for quality,
          design, and performance.
        </p>
      </div>
      <Suspense fallback={null}>
        <ShopContent />
      </Suspense>
    </section>
  )
}
