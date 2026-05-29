import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <section className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="space-y-8">
          <Skeleton className="h-12 w-1/2 max-w-xl rounded-full" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4 rounded-2xl bg-secondary/30 p-6">
                <Skeleton className="h-6 w-2/5 rounded-full" />
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
              <div className="space-y-4 rounded-2xl bg-secondary/30 p-6">
                <Skeleton className="h-6 w-2/5 rounded-full" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl bg-secondary/30 p-6">
                <Skeleton className="h-6 w-1/3 rounded-full" />
                <Skeleton className="mt-6 h-12 w-32 rounded-full" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-40 rounded-3xl" />
                <Skeleton className="h-40 rounded-3xl" />
                <Skeleton className="h-40 rounded-3xl" />
                <Skeleton className="h-40 rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
