"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Menu, X, Zap, User, LogOut, Heart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth-store"

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
]

export function Navbar() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuthStore()

  function handleLogout() {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-accent" strokeWidth={2.5} />
          <span className="text-xl font-bold tracking-tight text-foreground">
            VOLT
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-foreground",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Sign Up
              </Link>
            </div>
          )}

          <Link
            href="/wishlist"
            className="relative flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground mr-2"
          >
            <Heart className="h-5 w-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors",
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <User className="h-4 w-4" />
                    {user.name}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileOpen(false)
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="pt-4 border-t border-border flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground"
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
                >
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
