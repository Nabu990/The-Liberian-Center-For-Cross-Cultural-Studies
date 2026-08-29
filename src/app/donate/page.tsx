"use client"

import { useState } from 'react'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, GraduationCap, BookOpen, Users, Award, Building2, CreditCard, Banknote } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

export default function DonatePage() {
  const searchParams = useSearchParams()
  const canceled = searchParams.get('status') === 'cancelled'
  
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const presetAmounts = ['$25', '$50', '$100', '$250', '$500', '$1000']

  const handlePresetAmount = (preset: string) => {
    setAmount(preset)
    setCustomAmount('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const donationAmount = customAmount || amount?.replace('$', '')
    if (!donationAmount || parseFloat(donationAmount) < 1) {
      setError('Please enter a valid donation amount (minimum $1)')
      return
    }

    if (!isAnonymous && (!donorName || !donorEmail)) {
      setError('Please provide your name and email')
      return
    }

    if (!isAnonymous && !donorEmail.includes('@')) {
      setError('Please provide a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/donate/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          donorName: isAnonymous ? 'Anonymous' : donorName,
          donorEmail: isAnonymous ? '' : donorEmail,
          donorPhone: isAnonymous ? '' : donorPhone,
          message,
          isAnonymous,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Failed to create payment link')
      }

      // Redirect to Flutterwave checkout (commented out)
      // if (data.link_url) {
      //   window.location.href = data.link_url
      // } else {
      //   throw new Error('No payment link returned')
      // }

      // Show error since payment is disabled
      throw new Error('Payment integration is currently disabled. Please use bank transfer or mobile money options below.')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Heart className="h-10 w-10 text-gold-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 font-heading">Support LCCCS</h1>
            <p className="text-xl text-gray-200 mb-8">
              Your donation helps us provide world-class education and empower the next generation of leaders in Liberia and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Donation Form */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">Make a Donation</CardTitle>
                  <CardDescription>Choose an amount and complete your donation</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    
                    {canceled && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 p-3 rounded-md text-sm">
                        Payment was canceled. Please try again.
                      </div>
                    )}

                    {/* Preset Amounts */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Select Amount</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {presetAmounts.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handlePresetAmount(preset)}
                            className={`py-3 px-4 rounded-lg border-2 transition-all ${
                              amount === preset
                                ? 'border-royal-600 bg-royal-600 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-royal-600'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <Label htmlFor="customAmount" className="text-sm font-medium">Or Enter Custom Amount (USD)</Label>
                      <Input
                        id="customAmount"
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          setAmount('')
                        }}
                        className="mt-1"
                        min="1"
                      />
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="donorName" className="text-sm font-medium">Full Name</Label>
                        <Input
                          id="donorName"
                          placeholder="John Doe"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          className="mt-1"
                          required={!isAnonymous}
                          disabled={isAnonymous}
                        />
                      </div>

                      <div>
                        <Label htmlFor="donorEmail" className="text-sm font-medium">Email Address</Label>
                        <Input
                          id="donorEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          className="mt-1"
                          required={!isAnonymous}
                          disabled={isAnonymous}
                        />
                      </div>

                      <div>
                        <Label htmlFor="donorPhone" className="text-sm font-medium">Phone Number (Optional)</Label>
                        <Input
                          id="donorPhone"
                          type="tel"
                          placeholder="+231 XXX XXXX"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          className="mt-1"
                          disabled={isAnonymous}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 text-royal-600 border-gray-300 rounded focus:ring-royal-600"
                        />
                        <Label htmlFor="anonymous" className="text-sm">Make this donation anonymous</Label>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium">Message (Optional)</Label>
                      <textarea
                        id="message"
                        placeholder="Add a message with your donation..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-royal-600 dark:bg-gray-700"
                        rows={3}
                      />
                    </div>

                    {/* Payment Method */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
                      <div className="space-y-3">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between p-4 border-2 border-royal-600 bg-royal-50 dark:bg-royal-900/20 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-5 w-5 text-royal-600" />
                            <span className="font-medium">Card, Mobile Money & Bank Transfer</span>
                          </div>
                          <div className="flex space-x-2">
                            <span className="text-xs text-gray-500">Visa</span>
                            <span className="text-xs text-gray-500">Mastercard</span>
                            <span className="text-xs text-gray-500">MTN</span>
                            <span className="text-xs text-gray-500">Orange</span>
                          </div>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {/* Secure payments powered by Flutterwave */}
                        Payment integration currently disabled
                      </p>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                      {loading ? 'Processing...' : 'Donate Now'}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Your donation is secure and tax-deductible. By donating, you agree to our terms and privacy policy.
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Impact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">Your Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <GraduationCap className="h-5 w-5 text-royal-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Scholarships</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Help deserving students access quality education through our scholarship programs.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="h-5 w-5 text-royal-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Library Resources</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Expand our library with books, digital resources, and research materials.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-royal-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Faculty Support</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Support our dedicated faculty members in their teaching and research.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-royal-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Infrastructure</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Help build and maintain classrooms, laboratories, and campus facilities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-royal-50 dark:bg-royal-900/20 border-royal-200 dark:border-royal-700">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-royal-600">Other Ways to Give</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium text-royal-600">Bank Transfer</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Bank: Ecobank Liberia<br />
                        Account Name: LCCCS<br />
                        Account Number: XXXXXXXXXX
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-royal-600">Mobile Money</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        MTN: XXX XXX XXX<br />
                        Orange Money: XXX XXX XXX
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-royal-600">In-Kind Donations</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Books, equipment, and other educational materials are welcome.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">Contact Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      For questions about donations or to discuss larger contributions, please contact our development office.
                    </p>
                    <p className="text-sm font-medium">Email: donations@lcccs.edu</p>
                    <p className="text-sm font-medium">Phone: +231 XXX XXXX</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
