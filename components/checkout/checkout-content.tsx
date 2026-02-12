"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, ShoppingBag, Check, CreditCard, Banknote } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"

declare global {
  interface Window {
    Razorpay: any
  }
}

export function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card")

  const shipping = totalPrice >= 100 ? 0 : 12
  const total = totalPrice + shipping

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  async function handleRazorpayPayment(formData: FormData) {
    try {
      // Fetch Razorpay key
      const keyRes = await fetch("/api/razorpay-key")
      const keyData = await keyRes.json()

      if (!keyRes.ok) {
        throw new Error("Unable to load payment gateway")
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      const options = {
        key: keyData.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Volt Electronics",
        description: "Transaction",
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch("/api/verify-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            setOrderPlaced(true)
            clearCart()
          } else {
            toast.error("Payment verification failed")
          }
        },
        prefill: {
          name: `${formData.get("firstName")} ${formData.get("lastName")}`,
          email: formData.get("email"),
          contact: formData.get("phone"),
        },
        theme: {
          color: "#000000",
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error(error)
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    if (paymentMethod === "cash") {
      // Simulate API call for cash order
      setTimeout(() => {
        setIsSubmitting(false)
        setOrderPlaced(true)
        clearCart()
      }, 1500)
    } else {
      // Razorpay
      await handleRazorpayPayment(formData)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-lg font-medium text-foreground">
          Nothing to check out
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add some products to your cart before checking out.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <Check className="h-8 w-8 text-accent" />
        </div>
        <h2 className="mt-6 font-serif text-2xl text-foreground">
          Order Confirmed
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you for your purchase. You will receive a confirmation email
          shortly with your order details and tracking information.
        </p>
        <div className="mt-4 rounded-lg bg-muted px-4 py-2">
          <p className="text-xs text-muted-foreground">Order Number</p>
          <p className="text-sm font-semibold tracking-wide text-foreground">
            #VE-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
        </div>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-5">
      {/* Form Side */}
      <form onSubmit={handleSubmit} className="lg:col-span-3">
        <Link
          href="/cart"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>

        {/* Step 1 - Contact */}
        <fieldset className="mb-10">
          <legend className="flex items-center gap-3 text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
              1
            </span>
            <span className="text-sm font-semibold uppercase tracking-widest">
              Contact Information
            </span>
          </legend>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(555) 000-0000"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
          </div>
        </fieldset>

        {/* Step 2 - Shipping */}
        <fieldset className="mb-10">
          <legend className="flex items-center gap-3 text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
              2
            </span>
            <span className="text-sm font-semibold uppercase tracking-widest">
              Shipping Address
            </span>
          </legend>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="Jane"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Doe"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                Street Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                placeholder="123 Main Street"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                placeholder="San Francisco"
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="state"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  placeholder="CA"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label
                  htmlFor="zip"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  ZIP
                </label>
                <input
                  id="zip"
                  name="zip"
                  type="text"
                  required
                  placeholder="94105"
                  className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Step 3 - Payment */}
        <fieldset className="mb-10">
          <legend className="flex items-center gap-3 text-foreground">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
              3
            </span>
            <span className="text-sm font-semibold uppercase tracking-widest">
              Payment Method
            </span>
          </legend>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <label className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-primary/50'}`}>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="hidden"
                />
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${paymentMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Credit/Debit Card</p>
                  <p className="text-xs text-muted-foreground">Pay securely via Razorpay</p>
                </div>
              </div>
            </label>

            <label className={`cursor-pointer rounded-xl border p-4 transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-primary/50'}`}>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="hidden"
                />
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${paymentMethod === 'cash' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Banknote className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Pay when you receive</p>
                </div>
              </div>
            </label>
          </div>
        </fieldset>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
          >
            <Lock className="h-4 w-4" />
            {isSubmitting
              ? "Processing..."
              : paymentMethod === 'card'
                ? `Pay $${total.toFixed(2)}`
                : `Place Cash Order - $${total.toFixed(2)}`
            }
          </button>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Your payment information is encrypted and secure
          </p>
        </div>
      </form>

      {/* Order Summary Sidebar */}
      <aside className="lg:col-span-2">
        <div className="sticky top-32 rounded-xl bg-card p-8 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Order Summary
          </h2>

          <div className="mt-6 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <div className="absolute inset-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <span className="absolute -right-1.5 -top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background shadow-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.product.category}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Total
              </span>
              <span className="text-xl font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
