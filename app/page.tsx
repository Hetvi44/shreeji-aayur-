import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { BestSellersSection } from "@/components/bestsellers-section"
import { NewArrivalsSection } from "@/components/new-arrivals-section"
import { ComboOffersBanner } from "@/components/combo-offers-banner"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { BlogPreviewSection } from "@/components/blog-preview-section"
import { FAQSection } from "@/components/faq-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"

export default function Home() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <BestSellersSection />
      <NewArrivalsSection />
      <ComboOffersBanner />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <FAQSection />
      <NewsletterSection />
      <Footer />
      <MobileNav />
    </main>
  )
}
