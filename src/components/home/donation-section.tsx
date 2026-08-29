"use client"

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, GraduationCap, BookOpen, Users, Award } from 'lucide-react'
import Link from 'next/link'

export function DonationSection() {
  const impacts = [
    {
      icon: GraduationCap,
      title: 'Scholarships',
      description: 'Help deserving students access quality education',
    },
    {
      icon: BookOpen,
      title: 'Library Resources',
      description: 'Expand our library with books and digital materials',
    },
    {
      icon: Users,
      title: 'Faculty Support',
      description: 'Support our dedicated teachers and researchers',
    },
    {
      icon: Award,
      title: 'Infrastructure',
      description: 'Build and maintain classrooms and facilities',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-royal-50 to-gold-50 dark:from-royal-900/20 dark:to-gold-900/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-royal-100 dark:bg-royal-800 rounded-full mb-6">
            <Heart className="h-8 w-8 text-royal-600 dark:text-royal-400" />
          </div>
          <h2 className="text-4xl font-bold text-royal-900 dark:text-white mb-4 font-heading">
            Support Our Mission
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your donation helps us provide world-class education and empower the next generation of leaders in Liberia and beyond.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-royal-200 dark:border-royal-700 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-royal-100 dark:bg-royal-800 rounded-full mb-4">
                    <impact.icon className="h-6 w-6 text-royal-600 dark:text-royal-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-royal-900 dark:text-white">
                    {impact.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {impact.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/donate">
            <Button size="lg" className="bg-royal-600 hover:bg-royal-700 text-white px-8 py-6 text-lg">
              <Heart className="h-5 w-5 mr-2" />
              Donate Now
            </Button>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Your donation is tax-deductible and makes a real difference.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
