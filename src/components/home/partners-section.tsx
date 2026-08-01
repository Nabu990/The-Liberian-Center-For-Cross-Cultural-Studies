"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const partners = [
  { name: 'Harvard University', logo: 'H' },
  { name: 'MIT', logo: 'M' },
  { name: 'Stanford', logo: 'S' },
  { name: 'Oxford', logo: 'O' },
  { name: 'Cambridge', logo: 'C' },
  { name: 'Yale', logo: 'Y' },
]

export function PartnersSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 font-heading">Our Partners</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Collaborating with world-class institutions to advance education
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center justify-center h-24 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-royal-600 dark:text-royal-400 mb-2">
                  {partner.logo}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{partner.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
