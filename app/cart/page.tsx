import { CartContent } from "@/components/cart/cart-content"

export const metadata = {
  title: "Cart - Volt Electronics",
  description: "Review your cart and proceed to checkout.",
}

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Your Selection
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Shopping Cart
        </h1>
      </div>
      <CartContent />
    </section>
  )
}
