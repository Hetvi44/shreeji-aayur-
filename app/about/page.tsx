import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Leaf, Heart, Sparkles, Award, Users, Globe } from "lucide-react"

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Every ingredient is sourced from certified organic farms across India, ensuring purity and potency in every drop.",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description: "We never test on animals. All our products are vegan-friendly and made with compassion for all living beings.",
  },
  {
    icon: Sparkles,
    title: "Made for Indian Skin",
    description: "Formulations specifically designed for Indian skin types and climate, understanding the unique needs of our customers.",
  },
  {
    icon: Award,
    title: "Ancient Wisdom",
    description: "Time-tested Ayurvedic recipes passed down through generations, now available for modern skincare needs.",
  },
]

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "50K+", label: "Happy Customers" },
  { value: "100%", label: "Natural Ingredients" },
  { value: "25+", label: "Products" },
]

const team = [
  {
    name: "Dr. Anjali Sharma",
    role: "Founder & Chief Formulator",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    bio: "With over 20 years in Ayurvedic medicine, Dr. Sharma brings ancient wisdom to modern skincare.",
  },
  {
    name: "Priya Mehta",
    role: "Head of Product Development",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    bio: "A biochemist passionate about creating effective, natural skincare solutions for Indian women.",
  },
  {
    name: "Rahul Verma",
    role: "Sustainability Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    bio: "Leading our mission towards sustainable sourcing and eco-friendly packaging initiatives.",
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1600&auto=format&fit=crop"
          alt="About ShreejiAayur"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-light font-serif text-background mb-4 max-w-2xl">
              Where Ancient Wisdom Meets Modern Beauty
            </h1>
            <p className="text-lg md:text-xl text-background/80 max-w-xl">
              Discover the story behind ShreejiAayur and our commitment to bringing authentic Ayurvedic skincare to every Indian home.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-light font-serif mb-6">
                Born from a Grandmother&apos;s Kitchen
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  ShreejiAayur was born from a simple belief: true beauty comes from nature. Our founder, Dr. Anjali Sharma, 
                  grew up watching her grandmother create miraculous skincare remedies using herbs from her own garden in 
                  Kerala.
                </p>
                <p>
                  Those memories of natural ingredients, traditional recipes, and the gentle care of Ayurveda stayed with her. 
                  After completing her doctorate in Ayurvedic Medicine, she set out to share these time-tested formulations 
                  with the world.
                </p>
                <p>
                  Today, ShreejiAayur continues to honor that legacy. We work directly with organic farmers across India, 
                  sourcing the purest ingredients while supporting local communities. Every product is handcrafted with the 
                  same love and care that started in a grandmother&apos;s kitchen.
                </p>
              </div>
              <Button asChild className="rounded-full mt-8">
                <Link href="/products">Explore Our Products</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
                  alt="Founder with ingredients"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 md:-left-12 bg-card rounded-2xl p-6 shadow-lg max-w-[200px]">
                <div className="text-4xl font-light text-primary mb-2 font-serif">15+</div>
                <p className="text-sm text-muted-foreground">Years of Ayurvedic excellence and trusted skincare</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-light font-serif mb-2">{stat.value}</div>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-light font-serif">What We Stand For</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(value => (
              <div key={value.title} className="bg-card p-6 rounded-2xl text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium font-serif mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-light font-serif">The Faces Behind ShreejiAayur</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map(member => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4">
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                </div>
                <h3 className="font-medium font-serif text-lg">{member.name}</h3>
                <p className="text-sm text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-video rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop"
                  alt="Sustainable practices"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">Sustainability</span>
              <h2 className="text-3xl md:text-4xl font-light font-serif mb-6">
                Our Commitment to the Planet
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  At ShreejiAayur, sustainability is not just a buzzword - it is at the core of everything we do. 
                  From sourcing to packaging, we are committed to minimizing our environmental footprint.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Eco-friendly, recyclable packaging made from post-consumer materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Direct partnerships with organic farmers, ensuring fair wages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>Carbon-neutral shipping on all orders within India</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light font-serif mb-4">
            Ready to Experience Authentic Ayurveda?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of customers who have transformed their skincare routine with our natural products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="rounded-full" size="lg">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-full" size="lg">
              <Link href="/blog">Read Our Blog</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </main>
  )
}
