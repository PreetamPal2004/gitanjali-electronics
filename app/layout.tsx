import React from "react"
import type { Metadata } from "next"
import { Inter, DM_Serif_Display } from "next/font/google"
import { Toaster } from "sonner"
import { CartProvider } from "@/components/cart-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
})

export const metadata: Metadata = {
  title: "Volt Electronics - Premium Tech, Simplified",
  description:
    "Discover curated premium electronics with clean design and exceptional quality. Headphones, smartwatches, speakers, and more.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
