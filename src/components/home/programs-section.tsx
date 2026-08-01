"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, BookOpen, Users, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const programs = [
  {
    title: 'Cross-Cultural Studies',
    description: 'Explore the dynamics of cultural interaction and global communication.',
    icon: Globe,
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'International Relations',
    description: 'Understand global politics, diplomacy, and international cooperation.',
    icon: Users,
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Anthropology',
    description: 'Study human societies, cultures, and their development.',
    icon: BookOpen,
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Linguistics',
    description: 'Analyze language structure, evolution, and cultural communication.',
    icon: BookOpen,
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Global Business',
    description: 'Prepare for international business with cross-cultural expertise.',
    icon: Globe,
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Peace & Conflict Studies',
    description: 'Learn conflict resolution and peacebuilding strategies.',
    icon: Users,
    duration: '4 Years',
    credits: 120,
  },
]

export function ProgramsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 font-heading">Our Programs</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover diverse academic programs designed to prepare you for global leadership
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardHeader>
                  <program.icon className="h-12 w-12 mb-4 text-royal-600 dark:text-royal-400" />
                  <CardTitle className="font-heading">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>Duration: {program.duration}</span>
                    <span>Credits: {program.credits}</span>
                  </div>
                  <Link href="/academics">
                    <Button variant="ghost" className="w-full">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/academics">
            <Button size="lg" variant="outline">
              View All Programs
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
