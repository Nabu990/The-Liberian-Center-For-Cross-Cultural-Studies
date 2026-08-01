import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink, Mail, MapPin, MessageCircle, Navigation as NavigationIcon, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-white mb-6 font-heading">Contact Us</h1>
          <p className="text-xl text-gray-200 max-w-3xl">
            Get in touch with us for inquiries, admissions, or any questions you may have
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-royal-600 mb-2" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">info@lcccs.edu</p>
                <p className="text-gray-600 dark:text-gray-300">admissions@lcccs.edu</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 text-royal-600 mb-2" />
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">+231 XXX XXXX</p>
                <p className="text-gray-600 dark:text-gray-300">+231 XXX XXXX</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-8 w-8 text-royal-600 mb-2" />
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">Monrovia, Liberia</p>
                <p className="text-gray-600 dark:text-gray-300">West Africa</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Send us a Message</h2>
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Your message..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* WhatsApp and Social Media */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center font-heading">Connect With Us</h2>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center gap-4 mb-8">
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </Button>
              <Button size="lg" variant="outline" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </Button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Follow us on social media for updates and news
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="lg">Facebook</Button>
              <Button variant="ghost" size="lg">Twitter</Button>
              <Button variant="ghost" size="lg">LinkedIn</Button>
              <Button variant="ghost" size="lg">Instagram</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold font-heading">Find Us</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Visit us in Monrovia, Liberia, West Africa.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
                  <div className="relative min-h-96 bg-gray-200 dark:bg-gray-700">
                    <iframe
                      title="Map showing The Liberian Center For Cross Cultural Studies"
                      className="absolute inset-0 h-full w-full border-0"
                      src="https://www.google.com/maps?q=The%20Liberian%20Center%20For%20Cross%20Cultural%20Studies&z=15&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
                    <div>
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-royal-100 text-royal-700 dark:bg-royal-900/40 dark:text-royal-300">
                        <MapPin className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="text-xl font-semibold font-heading">Our location</h3>
                      <address className="mt-3 not-italic leading-7 text-gray-600 dark:text-gray-300">
                        Monrovia, Liberia<br />
                        West Africa
                      </address>
                    </div>
                    <div className="space-y-3">
                      <Button asChild className="w-full gap-2">
                        <a
                          href="https://www.google.com/maps/dir/?api=1&destination=The%20Liberian%20Center%20For%20Cross%20Cultural%20Studies"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <NavigationIcon className="h-4 w-4" aria-hidden="true" />
                          Get directions
                        </a>
                      </Button>
                      <Button asChild variant="outline" className="w-full gap-2">
                        <a
                          href="https://www.google.com/maps?q=The%20Liberian%20Center%20For%20Cross%20Cultural%20Studies"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          Open in Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
