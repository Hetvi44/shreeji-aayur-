"use client"

import Image from "next/image"
import { Leaf, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Pure, plant-based ingredients sourced from trusted organic farms across India.",
  },
  {
    icon: Sparkles,
    title: "Ancient Wisdom",
    description: "Time-tested Ayurvedic formulations passed down through generations.",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description: "Never tested on animals. Vegan-friendly and ethically produced.",
  },
]

export function BrandStorySection() {
  return (
    <section id="story" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop"
                alt="Natural ingredients and Ayurvedic herbs"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-card rounded-2xl p-6 shadow-lg border border-border/50 max-w-[200px]">
              <div className="text-4xl font-light text-primary mb-2">15+</div>
              <p className="text-sm text-muted-foreground">Years of Ayurvedic excellence and trusted skincare</p>
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-6 text-balance">
              Where Ancient Wisdom Meets Modern Beauty
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              ShreejiAayur was born from a simple belief: true beauty comes from nature. 
              Our founder&apos;s grandmother was a renowned Ayurvedic practitioner who created 
              miraculous skincare recipes using herbs from her own garden.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Today, we honor that legacy by bringing those same time-tested formulations 
              to the modern world. Each product is handcrafted with love, using only the 
              purest ingredients sourced directly from organic farms across India.
            </p>

            {/* Values */}
            <div className="grid gap-6 mb-8">
              {values.map((value) => (
                <div key={value.title} className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{value.title}</h4>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="rounded-full px-8">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
