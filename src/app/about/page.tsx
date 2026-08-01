import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 font-heading">About LCCCS</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Discover our mission, vision, and the rich history of the Liberian Center for Cross Cultural Studies
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 font-heading">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              To provide world-class education that fosters cross-cultural understanding, promotes academic excellence, and prepares students to become global leaders who bridge cultural divides and contribute positively to society.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 font-heading">Our Vision</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              To be the leading institution in Africa for cross-cultural studies, recognized globally for our innovative approach to education, research excellence, and commitment to fostering international cooperation and understanding.
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Our History</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="border-l-4 border-royal-600 pl-6">
                <h3 className="text-2xl font-semibold mb-2">Founded in 2010</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  LCCCS was established with a vision to create a center of excellence for cross-cultural studies in Liberia and West Africa.
                </p>
              </div>
              <div className="border-l-4 border-gold-500 pl-6">
                <h3 className="text-2xl font-semibold mb-2">Growth and Expansion</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Over the years, we have grown from a small institution to a comprehensive university offering diverse programs across multiple disciplines.
                </p>
              </div>
              <div className="border-l-4 border-royal-600 pl-6">
                <h3 className="text-2xl font-semibold mb-2">International Recognition</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Today, LCCCS is recognized internationally for our academic excellence and contributions to cross-cultural research and education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Leadership</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-32 h-32 bg-royal-200 dark:bg-royal-800 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dr. John Doe</h3>
              <p className="text-gray-600 dark:text-gray-400">President</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-royal-200 dark:bg-royal-800 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prof. Jane Smith</h3>
              <p className="text-gray-600 dark:text-gray-400">Vice President Academic</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-royal-200 dark:bg-royal-800 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dr. Michael Johnson</h3>
              <p className="text-gray-600 dark:text-gray-400">Dean of Students</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
