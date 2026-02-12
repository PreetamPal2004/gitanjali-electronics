export default function ShopLoading() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="max-w-xl">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-5 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-12 flex flex-wrap gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-muted" />
        ))}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="aspect-square animate-pulse rounded-lg bg-muted" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  )
}
