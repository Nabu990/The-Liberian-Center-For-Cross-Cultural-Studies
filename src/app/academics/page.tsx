import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Calendar, Award } from 'lucide-react'
import Link from 'next/link'

const programs = [
  {
    title: 'Cross-Cultural Studies',
    description: 'Explore the dynamics of cultural interaction and global communication.',
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'International Relations',
    description: 'Understand global politics, diplomacy, and international cooperation.',
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Anthropology',
    description: 'Study human societies, cultures, and their development.',
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Linguistics',
    description: 'Analyze language structure, evolution, and cultural communication.',
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Global Business',
    description: 'Prepare for international business with cross-cultural expertise.',
    duration: '4 Years',
    credits: 120,
  },
  {
    title: 'Peace & Conflict Studies',
    description: 'Learn conflict resolution and peacebuilding strategies.',
    duration: '4 Years',
    credits: 120,
  },
]

export default function AcademicsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 font-heading">Academics</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Discover our diverse academic programs designed to prepare you for global leadership
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Our Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <BookOpen className="h-12 w-12 mb-4 text-royal-600 dark:text-royal-400" />
                  <CardTitle className="font-heading">{program.title}</CardTitle>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>Duration: {program.duration}</span>
                    <span>Credits: {program.credits}</span>
                  </div>
                  <Button variant="ghost" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Departments</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              'Department of Anthropology',
              'Department of International Relations',
              'Department of Linguistics',
              'Department of Business Studies',
              'Department of Peace Studies',
              'Department of Cultural Studies',
              'Department of Political Science',
              'Department of Economics',
            ].map((dept, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{dept}</h3>
                  <Button variant="ghost" size="sm">Explore</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Calendar */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Academic Calendar</h2>
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-royal-600" />
                  2024-2025 Academic Year
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span>Fall Semester</span>
                    <span className="text-gray-600 dark:text-gray-400">September 2024 - December 2024</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span>Winter Break</span>
                    <span className="text-gray-600 dark:text-gray-400">December 2024 - January 2025</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span>Spring Semester</span>
                    <span className="text-gray-600 dark:text-gray-400">January 2025 - May 2025</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span>Summer Session</span>
                    <span className="text-gray-600 dark:text-gray-400">June 2025 - August 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Graduation</span>
                    <span className="text-gray-600 dark:text-gray-400">May 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Research & Innovation</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Award className="h-8 w-8 text-gold-500 mb-2" />
                <CardTitle>Cross-Cultural Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Pioneering research in cross-cultural communication and understanding.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-gold-500 mb-2" />
                <CardTitle>Faculty Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Our distinguished faculty members are leaders in their respective fields.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-gold-500 mb-2" />
                <CardTitle>Publications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Regular publications in top-tier academic journals worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
