"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const news = [
  {
    title: 'LCCCS Launches New International Partnership Program',
    excerpt: 'Expanding global collaborations with universities across Africa, Europe, and Asia.',
    date: '2024-01-15',
    category: 'Partnership',
  },
  {
    title: 'Research Grant Awarded for Cross-Cultural Communication Study',
    excerpt: 'Our faculty receives major funding to research intercultural dialogue in West Africa.',
    date: '2024-01-10',
    category: 'Research',
  },
  {
    title: 'Student Exchange Program Applications Now Open',
    excerpt: 'Apply for our semester abroad program in partner institutions worldwide.',
    date: '2024-01-05',
    category: 'Student Life',
  },
]

export function NewsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4 font-heading">Latest News</h2>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with our latest achievements and announcements</p>
          </div>
          <Link href="/news">
            <Button variant="outline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-royal-100 dark:bg-royal-900 text-royal-600 dark:text-royal-400 text-xs font-medium rounded-full mb-3">
                    {item.category}
                  </span>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-3 font-heading">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{item.excerpt}</p>
                  <Link href={`/news/${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="ghost" size="sm">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
