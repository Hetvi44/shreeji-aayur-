"use client"

import { Leaf, Shield, FlaskConical, Heart, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description: "All our products are made from certified organic ingredients sourced from trusted farms across India.",
  },
  {
    icon: Heart,
    title: "Cruelty Free",
    description: "We never test on animals. All our products are vegan-friendly and ethically produced.",
  },
  {
    icon: Sparkles,
    title: "Made for Indian Skin",
    description: "Formulations specifically designed for Indian skin types and climate conditions.",
  },
  {
    icon: FlaskConical,
    title: "Natural Ingredients",
    description: "No harsh chemicals, parabens, or sulfates. Only pure, natural goodness for your skin.",
  },
  {
    icon: Shield,
    title: "Dermatologically Tested",
    description: "All products are tested and approved by dermatologists for safety and efficacy.",
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

export function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
            Why ShreejiAayur
          </span>
          <h2 className="text-3xl md:text-4xl font-light font-serif mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We believe in the power of nature and ancient Ayurvedic wisdom to transform your skin naturally.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="text-center p-6 rounded-2xl bg-card hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium mb-2 font-serif">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
