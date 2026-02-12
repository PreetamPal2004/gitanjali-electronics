import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react"

const props = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary delivery on all orders over $100",
  },
  {
    icon: ShieldCheck,
    title: "2-Year Warranty",
    description: "Extended coverage on every product we sell",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return and exchange policy",
  },
  {
    icon: Headset,
    title: "Expert Support",
    description: "Dedicated team available 7 days a week",
  },
]

export function ValueProps() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {props.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <prop.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {prop.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
