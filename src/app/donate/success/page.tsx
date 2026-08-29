"use client"

import { useEffect, useState } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, CheckCircle } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function DonateSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Flutterwave payment status handling (commented out)
    // const status = searchParams.get('status')
    // const tx_ref = searchParams.get('tx_ref')
    
    // if (status === 'successful' && tx_ref) {
    //   setLoading(false)
    // } else if (status === 'cancelled') {
    //   setError('Payment was canceled')
    //   setLoading(false)
    // } else if (status === 'failed') {
    //   setError('Payment failed')
    //   setLoading(false)
    // } else {
    //   setError('Invalid payment status')
    //   setLoading(false)
    // }

    // Payment integration disabled
    setError('Payment integration is currently disabled')
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-20">
          <div className="text-white text-xl">Processing your donation...</div>
        </section>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-20">
          <Card className="max-w-md mx-auto shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Payment {error}</CardTitle>
              <CardDescription>Please try again or contact support if the issue persists.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => router.push('/donate')}>Try Again</Button>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="font-heading text-3xl">Thank You for Your Donation!</CardTitle>
              <CardDescription className="text-lg">
                Your generosity helps us continue our mission of providing world-class education.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-700 dark:text-green-400 font-medium">
                  Your donation has been processed successfully.
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                A confirmation email has been sent to your email address with your donation receipt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push('/')} variant="outline">
                  Return Home
                </Button>
                <Button onClick={() => router.push('/donate')}>
                  Make Another Donation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  )
}
