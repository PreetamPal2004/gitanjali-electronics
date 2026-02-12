import Link from "next/link"
import { Headphones, Watch, Tablet, Mouse } from "lucide-react"

const categories = [
  {
    name: "Audio",
    description: "Headphones, speakers & earbuds",
    icon: Headphones,
    href: "/shop?category=Audio",
  },
  {
    name: "Wearables",
    description: "Smartwatches & fitness trackers",
    icon: Watch,
    href: "/shop?category=Wearables",
  },
  {
    name: "Devices",
    description: "Tablets, cameras & more",
    icon: Tablet,
    href: "/shop?category=Devices",
  },
  {
    name: "Accessories",
    description: "Keyboards, mice & peripherals",
    icon: Mouse,
    href: "/shop?category=Accessories",
  },
]

export function CategoryBanner() {
  return (
    <section className="bg-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Browse by Category
          </p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-background md:text-4xl">
            Find what you need
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center rounded-xl border border-muted-foreground/20 px-6 py-10 text-center transition-all hover:border-accent hover:bg-accent/10"
            >
              <cat.icon className="h-8 w-8 text-background transition-colors group-hover:text-accent" />
              <h3 className="mt-4 text-sm font-semibold tracking-wide text-background">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
