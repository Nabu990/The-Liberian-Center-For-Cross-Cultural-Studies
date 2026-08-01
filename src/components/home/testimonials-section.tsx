"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Quote, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Class of 2023',
    program: 'Cross-Cultural Studies',
    content: 'LCCCS transformed my understanding of global cultures. The faculty and diverse student body provided an unparalleled learning experience.',
    rating: 5,
  },
  {
    name: 'James Kollie',
    role: 'Class of 2022',
    program: 'International Relations',
    content: 'The international exposure and academic rigor prepared me perfectly for my career in diplomacy. I am forever grateful to LCCCS.',
    rating: 5,
  },
  {
    name: 'Amara Bah',
    role: 'Class of 2024',
    program: 'Anthropology',
    content: 'The research opportunities and mentorship here are exceptional. LCCCS truly cares about student success and personal growth.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 font-heading">Student Success Stories</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from our alumni about their transformative journey at LCCCS
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-royal-50 to-gold-50 dark:from-royal-900/20 dark:to-gold-900/20">
              <CardContent className="pt-12 pb-8 px-8">
                <Quote className="h-12 w-12 text-royal-600 dark:text-royal-400 mb-6" />
                <p className="text-2xl font-medium mb-8 text-gray-800 dark:text-gray-200 leading-relaxed">
                  {testimonials[currentIndex].content}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold font-heading">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[currentIndex].role} • {testimonials[currentIndex].program}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full p-0 ${
                  index === currentIndex ? 'bg-royal-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
