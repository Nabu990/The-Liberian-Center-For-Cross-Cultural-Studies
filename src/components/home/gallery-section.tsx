"use client"

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

const galleryItems = [
  { 
    category: 'Campus', 
    title: 'Main Campus Building',
    image: '/images/student-hall.jpeg'
  },
  { 
    category: 'Students', 
    title: 'Student Life',
    image: '/images/student-yard.jpeg'
  },
  { 
    category: 'Events', 
    title: 'Lecture-hall',
    image: '/images/Lecture-hall.jpeg'
  },
  { 
    category: 'construction', 
    title: 'construction',
    image: '/images/main-construction-inside.jpeg'
  },
  { 
    category: 'Campus', 
    title: 'Doorms',
    image: '/images/sideview-student-doorm.jpeg'
  },
  { 
    category: 'construction', 
    title: 'student doorm',
    image: '/images/construction-student-dorm.jpeg'
  },
   { 
    category: 'campus', 
    title: 'sky view',
    image: '/images/campus-sky-view.jpeg'
  },
]

export function GallerySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Campus Gallery</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Explore our beautiful campus and vibrant community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <span className="text-sm font-medium">{item.category}</span>
                  <h3 className="text-lg font-semibold mt-1">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
