"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import useEmblaCarousel from "embla-carousel-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "The Kumkumadi Serum has completely transformed my skin. After just 3 weeks, my dark spots have faded significantly. I have never felt more confident in my natural skin!",
    product: "Kumkumadi Radiance Serum",
  },
  {
    id: 2,
    name: "Ananya Patel",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    text: "I was skeptical about Ayurvedic skincare, but ShreejiAayur changed my mind. The quality is exceptional and I love knowing exactly what I am putting on my skin.",
    product: "Rose & Saffron Face Mist",
  },
  {
    id: 3,
    name: "Meera Krishnan",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    text: "The Brahmi Hair Oil has been a game-changer for my hair fall problem. My hair feels stronger and healthier than it has in years. Truly authentic Ayurveda!",
    product: "Brahmi Hair Oil",
  },
  {
    id: 4,
    name: "Deepika Nair",
    location: "Kerala",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop",
    text: "Finally found products that work with my sensitive skin! The natural ingredients are so gentle yet effective. My whole family has switched to ShreejiAayur.",
    product: "Neem Purifying Cleanser",
  },
]

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  })
  const [currentIndex, setCurrentIndex] = useState(0)

  const scrollPrev = () => {
    emblaApi?.scrollPrev()
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const scrollNext = () => {
    emblaApi?.scrollNext()
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
            Love Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-light font-serif">What Our Customers Say</h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="flex-none w-full px-4">
                  <div className="bg-card rounded-3xl p-6 md:p-10 text-center shadow-sm border border-border/50">
                    <Quote className="h-10 w-10 text-primary/30 mx-auto mb-6" />
                    <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-8 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-4 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-medium font-serif">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      <span className="inline-block mt-3 px-3 py-1 text-xs tracking-wide bg-secondary rounded-full text-secondary-foreground">
                        {testimonial.product}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
