import type { Metadata } from "next"
import { CheckoutContent } from "@/components/checkout/checkout-content"

export const metadata: Metadata = {
  title: "Checkout - Volt Electronics",
  description: "Complete your order securely.",
}

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Checkout
        </p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
          Complete Your Order
        </h1>
      </div>
      <CheckoutContent />
    </section>
  )
}
