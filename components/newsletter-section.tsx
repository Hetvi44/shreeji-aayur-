"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="h-10 w-10 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-light mb-4 font-serif">
            Join the ShreejiAayur Family
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Subscribe for exclusive offers, Ayurvedic beauty tips, and 15% off your first order.
          </p>

          {isSubmitted ? (
            <motion.div 
              className="bg-primary-foreground/10 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-xl font-medium font-serif">Welcome to the family!</p>
              <p className="opacity-90 mt-2">Check your inbox for your 15% discount code.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground/50"
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="rounded-full px-8 whitespace-nowrap font-medium"
              >
                Subscribe
              </Button>
            </form>
          )}

          <p className="text-sm opacity-70 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
