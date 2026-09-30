import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  "/checkout(.*)",
  "/orders(.*)",
  "/profile(.*)",
  "/wishlist(.*)",
  "/admin(.*)",
])

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
])

function getClaimRole(sessionClaims: Record<string, unknown> | null): string | undefined {
  if (!sessionClaims) return undefined
  const direct = sessionClaims.role
  if (typeof direct === "string") return direct

  const metadata = sessionClaims.metadata as Record<string, unknown> | undefined
  if (typeof metadata?.role === "string") return metadata.role

  const publicMetadata = (sessionClaims.publicMetadata ?? sessionClaims.public_metadata) as
    | Record<string, unknown>
    | undefined
  if (typeof publicMetadata?.role === "string") return publicMetadata.role

  return undefined
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  // Catalog admin: any signed-in user can access unless REQUIRE_ADMIN_ROLE=true
  // (Clerk JWT role claim is optional; set public_metadata.role = "admin" + session token when locking down)
  if (isAdminRoute(req) && process.env.REQUIRE_ADMIN_ROLE === "true") {
    const { sessionClaims } = await auth()
    if (getClaimRole(sessionClaims as Record<string, unknown> | null) !== "admin") {
      return Response.redirect(new URL("/", req.url))
    }
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
