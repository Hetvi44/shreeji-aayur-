"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const categories = [
  {
    name: "Skin Care",
    description: "Nourish & protect",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=500&auto=format&fit=crop",
    href: "/category/skin-care",
    count: 24,
  },
  {
    name: "Hair Care",
    description: "Strengthen & shine",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500&auto=format&fit=crop",
    href: "/category/hair-care",
    count: 18,
  },
  {
    name: "Body Care",
    description: "Pamper & rejuvenate",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=500&auto=format&fit=crop",
    href: "/category/body-care",
    count: 15,
  },
  {
    name: "Face Care",
    description: "Cleanse & glow",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop",
    href: "/category/face-care",
    count: 20,
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

export function CategoriesSection() {
  return (
    <section id="categories" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-light font-serif">Shop by Category</h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div key={category.name} variants={itemVariants}>
              <Link
                href={category.href}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-card block"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-card">
                  <span className="text-xs tracking-wider uppercase opacity-80 mb-1 block">
                    {category.count} Products
                  </span>
                  <h3 className="text-lg md:text-xl font-medium mb-1 font-serif">{category.name}</h3>
                  <p className="text-sm opacity-80 hidden md:block">{category.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
