import Link from "next/link"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" strokeWidth={2.5} />
              <span className="text-lg font-bold tracking-tight text-foreground">
                VOLT
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Premium electronics, curated for those who appreciate quality
              design and exceptional performance.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Navigation
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Categories
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link
                  href="/shop?category=Audio"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Audio
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Wearables"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Wearables
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Devices"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Devices
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=Accessories"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Contact
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="text-sm text-muted-foreground">
                hello@voltelectronics.com
              </li>
              <li className="text-sm text-muted-foreground">
                +1 (555) 012-3456
              </li>
              <li className="text-sm text-muted-foreground">
                123 Innovation Drive
                <br />
                San Francisco, CA 94105
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <p className="text-center text-xs text-muted-foreground">
            2026 Volt Electronics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
