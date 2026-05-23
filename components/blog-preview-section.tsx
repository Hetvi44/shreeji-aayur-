"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const blogPosts = [
  {
    id: 1,
    title: "10 Ayurvedic Ingredients for Glowing Skin",
    excerpt: "Discover the ancient secrets of Ayurveda that can transform your skincare routine and give you naturally radiant skin.",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500&auto=format&fit=crop",
    category: "Skincare Tips",
    date: "May 15, 2026",
    slug: "ayurvedic-ingredients-glowing-skin",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Hair Oiling",
    excerpt: "Learn the traditional Indian art of hair oiling and how it can prevent hair fall and promote healthy growth.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
    category: "Hair Care",
    date: "May 10, 2026",
    slug: "ultimate-guide-hair-oiling",
  },
  {
    id: 3,
    title: "Morning Skincare Routine for Indian Weather",
    excerpt: "A step-by-step guide to creating the perfect morning skincare routine suited for the Indian climate.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop",
    category: "Routines",
    date: "May 5, 2026",
    slug: "morning-skincare-routine-indian-weather",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function BlogPreviewSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
              Beauty Tips
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif">From Our Blog</h2>
          </div>
          <Button variant="outline" className="rounded-full mt-4 md:mt-0" asChild>
            <Link href="/blog">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium tracking-wide bg-card/90 backdrop-blur-sm text-foreground rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <time className="text-xs text-muted-foreground">{post.date}</time>
                  <h3 className="text-lg font-medium mt-2 mb-3 font-serif group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
