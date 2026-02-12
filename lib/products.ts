export interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Aura Pro Headphones",
    price: 349,
    category: "Audio",
    image: "/images/headphones.jpg",
    description:
      "Premium wireless over-ear headphones with active noise cancellation, 40-hour battery life, and studio-grade sound quality.",
    featured: true,
  },
  {
    id: "2",
    name: "Pulse Smartwatch",
    price: 299,
    category: "Wearables",
    image: "/images/smartwatch.jpg",
    description:
      "Advanced health tracking smartwatch with AMOLED display, GPS, heart rate monitor, and 7-day battery life.",
    featured: true,
  },
  {
    id: "3",
    name: "Echo Speaker",
    price: 199,
    category: "Audio",
    image: "/images/speaker.jpg",
    description:
      "Portable Bluetooth speaker with 360-degree immersive sound, waterproof design, and 20-hour playtime.",
    featured: true,
  },
  {
    id: "4",
    name: "Apex Keyboard",
    price: 179,
    category: "Accessories",
    image: "/images/keyboard.jpg",
    description:
      "Compact wireless mechanical keyboard with tactile switches, customizable RGB backlighting, and aluminum frame.",
  },
  {
    id: "5",
    name: "Nova Earbuds",
    price: 159,
    category: "Audio",
    image: "/images/earbuds.jpg",
    description:
      "True wireless earbuds with hybrid noise cancellation, transparency mode, and 30-hour total battery life.",
  },
  {
    id: "6",
    name: "Slate Tablet",
    price: 599,
    category: "Devices",
    image: "/images/tablet.jpg",
    description:
      "Ultra-thin tablet with 11-inch Retina display, powerful processor, and all-day battery for work and entertainment.",
    featured: true,
  },
  {
    id: "7",
    name: "Lens Compact Camera",
    price: 899,
    category: "Devices",
    image: "/images/camera.jpg",
    description:
      "Mirrorless compact camera with 26MP sensor, 4K video recording, and advanced autofocus system.",
  },
  {
    id: "8",
    name: "Drift Wireless Mouse",
    price: 89,
    category: "Accessories",
    image: "/images/mouse.jpg",
    description:
      "Ergonomic wireless mouse with precision tracking, silent clicks, and 6-month battery life on a single charge.",
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getCategories(): string[] {
  return [...new Set(products.map((p) => p.category))]
}
