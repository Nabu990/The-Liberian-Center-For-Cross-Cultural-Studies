import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, DollarSign, FileText, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 font-heading">Admissions</h1>
          <p className="text-xl text-gray-200 max-w-3xl mb-8">
            Join our community of scholars and begin your journey toward academic excellence
          </p>
          <Link href="/admissions/apply">
            <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-white">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Admission Requirements */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Admission Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-royal-600" />
                  Undergraduate Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>High school diploma or equivalent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Minimum GPA of 3.0</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>SAT/ACT scores (optional)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Personal statement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Two letters of recommendation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-royal-600" />
                  Graduate Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Bachelor's degree from accredited institution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Minimum GPA of 3.5</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>GRE/GMAT scores (program dependent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Statement of purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>Three letters of recommendation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tuition and Fees */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Tuition & Fees</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Undergraduate</CardTitle>
                <CardDescription>Per Semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-royal-600 mb-4">$5,000</div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Tuition included</li>
                  <li>Library access</li>
                  <li>Student activities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-royal-600">
              <CardHeader>
                <CardTitle>Graduate</CardTitle>
                <CardDescription>Per Semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-royal-600 mb-4">$7,500</div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Tuition included</li>
                  <li>Research facilities</li>
                  <li>Conference support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International</CardTitle>
                <CardDescription>Per Semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-royal-600 mb-4">$6,500</div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Tuition included</li>
                  <li>Visa support</li>
                  <li>Housing assistance</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Financial Aid */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Financial Aid & Scholarships</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-gold-500 mb-2" />
                  <CardTitle>Merit Scholarships</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Academic excellence scholarships available for students with outstanding academic records.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-gold-500 mb-2" />
                  <CardTitle>Need-Based Aid</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Financial assistance available for students demonstrating financial need.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-gold-500 mb-2" />
                  <CardTitle>International Scholarships</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Special scholarships for international students to promote cultural diversity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <DollarSign className="h-8 w-8 text-gold-500 mb-2" />
                  <CardTitle>Work-Study Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    On-campus employment opportunities to help students cover educational expenses.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">How to Apply</h2>
          <div className="max-w-3xl mx-auto">
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-royal-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete Online Application</h3>
                  <p className="text-gray-600 dark:text-gray-300">Fill out our online application form with your personal and academic information.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-royal-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Submit Required Documents</h3>
                  <p className="text-gray-600 dark:text-gray-300">Upload transcripts, test scores, letters of recommendation, and personal statement.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-royal-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Pay Application Fee</h3>
                  <p className="text-gray-600 dark:text-gray-300">Submit the non-refundable application fee of $50.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-royal-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Await Decision</h3>
                  <p className="text-gray-600 dark:text-gray-300">Our admissions committee will review your application and notify you of the decision.</p>
                </div>
              </li>
            </ol>
            <div className="text-center mt-12">
              <Link href="/admissions/apply">
                <Button size="lg">Start Your Application</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
