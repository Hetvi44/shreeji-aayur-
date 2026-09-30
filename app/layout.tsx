import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ShreejiAayur | Premium Ayurvedic Skincare India',
  description:
    'Discover the ancient secrets of Ayurveda with our premium skincare collection. 100% Natural, Cruelty-Free, Made for Indian Skin. Shop Face Care, Hair Care, Body Care & more.',
  keywords: [
    'ayurvedic skincare',
    'natural beauty',
    'organic skincare',
    'ShreejiAayur',
    'Indian skincare',
    'cruelty free',
    'herbal beauty',
  ],
}

export const viewport: Viewport = {
  themeColor: '#fcfaf9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="bg-background">
        <body
          className={`${playfair.variable} ${inter.variable} font-sans antialiased`}
        >
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
