import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { CategoryBanner } from "@/components/home/category-banner"
import { ValueProps } from "@/components/home/value-props"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryBanner />
      <ValueProps />
    </>
  )
}
