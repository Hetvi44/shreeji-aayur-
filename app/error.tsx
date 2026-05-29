'use client'

import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <section className="container mx-auto max-w-3xl px-4 py-12 text-center">
        <div className="rounded-3xl border border-border bg-secondary/30 p-10">
          <h1 className="text-2xl font-serif font-semibold mb-4">Oops, something went wrong.</h1>
          <p className="text-sm text-muted-foreground mb-6">{error?.message || 'An unexpected error occurred.'}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-primary px-5 py-2 text-white hover:opacity-90"
            >
              Retry
            </button>
            <Link
              href="/"
              className="rounded-full border border-border px-5 py-2 text-muted-foreground hover:bg-secondary/50"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
