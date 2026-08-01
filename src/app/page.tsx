import HeroSection from '@/components/hero/hero-section'
import { StatisticsSection } from '@/components/home/statistics-section'
import { ProgramsSection } from '@/components/home/programs-section'
import { NewsSection } from '@/components/home/news-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { GallerySection } from '@/components/home/gallery-section'
import { EventsSection } from '@/components/home/events-section'
import { PartnersSection } from '@/components/home/partners-section'
import { Footer } from '@/components/layout/footer'
import { Navigation } from '@/components/layout/navigation'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatisticsSection />
      <ProgramsSection />
      <NewsSection />
      <TestimonialsSection />
      <GallerySection />
      <EventsSection />
      <PartnersSection />
      <Footer />
    </main>
  )
}
