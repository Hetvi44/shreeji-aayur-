"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
}

interface CategoriesSectionProps {
  categories: Category[]
}

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

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories.length) {
    return (
      <section id="categories" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
            Explore
          </span>
          <h2 className="text-3xl md:text-4xl font-light font-serif mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">Categories will appear here once added by the store admin.</p>
        </div>
      </section>
    )
  }

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
          {categories.map((category) => {
            const img = category.image || '/placeholder-image.jpg'
            return (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/category/${category.slug}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-card block"
              >
                <Image
                  src={img}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={img.startsWith('http')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-card">
                  <h3 className="text-lg md:text-xl font-medium mb-1 font-serif">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm opacity-80 hidden md:block">{category.description}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          )})}
        </motion.div>
      </div>
    </section>
  )
}
