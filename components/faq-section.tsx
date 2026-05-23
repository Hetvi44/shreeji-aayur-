"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const faqs = [
  {
    question: "Are your products suitable for all skin types?",
    answer: "Yes! Our Ayurvedic formulations are designed to work with your skin's natural balance. Each product is gentle yet effective, making them suitable for all skin types including sensitive skin. We recommend starting with a patch test if you have particularly reactive skin.",
  },
  {
    question: "How long does shipping take?",
    answer: "We offer free standard shipping on orders above ₹999, which typically takes 5-7 business days across India. Express shipping is available for 2-3 day delivery in metro cities. Cash on Delivery (COD) is available for all orders.",
  },
  {
    question: "What is your return policy?",
    answer: "We stand behind our products with a 30-day satisfaction guarantee. If you're not completely happy with your purchase, simply return the unused portion for a full refund. We believe in our products and want you to love them too!",
  },
  {
    question: "Are your products tested on animals?",
    answer: "Absolutely not. ShreejiAayur is proudly cruelty-free and vegan-friendly. We never test on animals and work only with suppliers who share our ethical values. Beauty should never come at the cost of animal welfare.",
  },
  {
    question: "How do I know which products are right for me?",
    answer: "We offer a free skin consultation service! Simply fill out our online skin quiz or reach out to our Ayurvedic experts who can recommend a personalized skincare routine based on your unique dosha and skin concerns.",
  },
  {
    question: "What makes Ayurvedic skincare different?",
    answer: "Ayurvedic skincare takes a holistic approach, treating the root cause rather than just symptoms. Our formulations use time-tested herbs and ingredients that have been used for thousands of years, combined with modern scientific research for optimal results.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-3 block">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-light font-serif">Frequently Asked Questions</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className="border-b border-border last:border-b-0"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-6 flex items-start justify-between text-left group"
              >
                <span className="text-lg font-medium pr-8 group-hover:text-primary transition-colors font-serif">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-muted-foreground leading-relaxed pr-12 pb-6">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
