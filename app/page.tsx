import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { CategoriesSection } from '@/components/categories-section'
import { BestSellersSection } from '@/components/bestsellers-section'
import { NewArrivalsSection } from '@/components/new-arrivals-section'
import { ComboOffersBanner } from '@/components/combo-offers-banner'
import { TrendingSection } from '@/components/trending-section'
import { WhyChooseUsSection } from '@/components/why-choose-us-section'
import { BrandStorySection } from '@/components/brand-story-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { BlogPreviewSection } from '@/components/blog-preview-section'
import { FAQSection } from '@/components/faq-section'
import { NewsletterSection } from '@/components/newsletter-section'
import { Footer } from '@/components/footer'
import { MobileNav } from '@/components/mobile-nav'
import { getProducts } from '@/lib/actions/products'
import { getCategories } from '@/lib/actions/categories'

export default async function Home() {
  const [bestSellers, newArrivals, trending, categories] = await Promise.all([
    getProducts({ featured: true, limit: 5 }),
    getProducts({ limit: 5 }),
    getProducts({ trending: true, limit: 5 }),
    getCategories(),
  ])

  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />
      <HeroSection />
      <CategoriesSection categories={categories} />
      <BestSellersSection products={bestSellers} />
      <NewArrivalsSection products={newArrivals} />
      <ComboOffersBanner />
      <TrendingSection products={trending} />
      <WhyChooseUsSection />
      <BrandStorySection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
      <MobileNav />
    </main>
  )
}
