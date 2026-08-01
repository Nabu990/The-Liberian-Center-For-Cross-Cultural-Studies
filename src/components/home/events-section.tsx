"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const events = [
  {
    title: 'International Cultural Festival',
    date: '2024-02-15',
    location: 'Main Campus',
    description: 'Celebrate diversity with food, music, and performances from around the world.',
  },
  {
    title: 'Academic Conference on Cross-Cultural Dialogue',
    date: '2024-03-20',
    location: 'Conference Hall',
    description: 'Join scholars and experts for discussions on global cultural exchange.',
  },
  {
    title: 'Graduation Ceremony',
    date: '2024-05-30',
    location: 'Main Auditorium',
    description: 'Celebrate the achievements of our graduating class.',
  },
]

export function EventsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h2 className="text-4xl font-bold mb-4 font-heading">Upcoming Events</h2>
            <p className="text-gray-600 dark:text-gray-400">Join us for exciting events and activities</p>
          </div>
          <Link href="/events">
            <Button variant="outline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 font-heading">{event.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{event.description}</p>
                  <Button variant="ghost" size="sm">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
