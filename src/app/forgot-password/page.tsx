"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Mail, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resetUrl, setResetUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setResetUrl('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Failed to send reset email')
      }

      setSuccess(true)
      
      // If email sending failed, show the reset link
      if (data.resetUrl) {
        setResetUrl(data.resetUrl)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600">
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/login">
            <Button variant="ghost" className="mb-6 text-gray-600 dark:text-gray-400 hover:text-royal-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
          <Card className="shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-royal-600 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="font-heading text-2xl">Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive a password reset link</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                {success && !resetUrl && (
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md text-sm">
                    Password reset email sent! Check your inbox for the reset link.
                  </div>
                )}
                
                {success && resetUrl && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 p-4 rounded-md text-sm space-y-3">
                    <p className="font-medium">Email sending failed. Use the link below to reset your password:</p>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Reset Link:</p>
                      <a 
                        href={resetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-royal-600 hover:underline break-all flex items-center gap-1"
                      >
                        {resetUrl}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This link will expire in 1 hour.
                    </p>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <div className="text-center text-sm pt-2">
                  <span className="text-gray-600 dark:text-gray-400">Remember your password? </span>
                  <Link href="/login" className="text-royal-600 hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
