import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata = {
  title: "About Us - Volt Electronics",
  description:
    "Learn about Volt Electronics and our mission to deliver premium technology with exceptional design and quality.",
}

const stats = [
  { value: "50K+", label: "Customers Worldwide" },
  { value: "200+", label: "Premium Products" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Customer Support" },
]

const values = [
  {
    number: "01",
    title: "Quality First",
    description:
      "Every product in our collection undergoes rigorous testing and evaluation. We only stock items that meet our exacting standards for build quality, performance, and longevity.",
  },
  {
    number: "02",
    title: "Design Matters",
    description:
      "We believe technology should be beautiful. Our curation focuses on products that are as visually refined as they are technically capable, bringing harmony between form and function.",
  },
  {
    number: "03",
    title: "Customer Obsessed",
    description:
      "From expert guidance before your purchase to dedicated support after, we are committed to making every interaction seamless. Your satisfaction drives every decision we make.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Our Story
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl text-balance">
              Built on a passion for great technology
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Volt Electronics started with a simple idea: make it easier for
              people to find electronics that are genuinely worth their
              investment. No filler, no compromises - just thoughtfully curated
              products that deliver on every promise.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/team.jpg"
              alt="Inside the Volt Electronics store showcasing premium products"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-serif text-3xl text-foreground md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            What We Stand For
          </p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Our core values
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.number}
              className="rounded-xl border border-border p-8"
            >
              <span className="font-serif text-3xl text-border">
                {value.number}
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center md:py-28">
          <h2 className="font-serif text-3xl tracking-tight text-background md:text-4xl text-balance">
            Ready to experience the difference?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Browse our curated collection and find the perfect piece of
            technology for your lifestyle.
          </p>
          <Link
            href="/shop"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-background px-8 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
