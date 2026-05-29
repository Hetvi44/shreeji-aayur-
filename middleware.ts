import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isProtectedRoute = createRouteMatcher([
  '/checkout(.*)',
  '/orders(.*)',
  '/profile',
  '/wishlist',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/category(.*)',
  '/search',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/about',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth()
  
  if (isAdminRoute(req)) {
    const userRole = (sessionClaims?.metadata as any)?.role
    if (userId && userRole !== 'ADMIN') {
      return new Response('Unauthorized', { status: 403 })
    }
  }

  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', req.url)
    return Response.redirect(signInUrl)
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|mp4|webm|ogg|mp3|wav|flac|aac|xlsx|pdf|ttf|woff2?|eot|otf)).*)',
    '/(api|trpc)(.*)',
  ],
}
