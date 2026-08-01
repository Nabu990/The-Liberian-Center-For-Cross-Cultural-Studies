"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600">
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 bg-royal-900/50">
          <div className="max-w-lg">
            <div className="flex items-center space-x-3 mb-8">
              <GraduationCap className="h-12 w-12 text-gold-400" />
              <span className="text-3xl font-bold font-heading text-white">LCCCS</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6 font-heading">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Sign in to access your dashboard, manage your courses, and stay connected with the Liberian Center for Cross Cultural Studies community.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                <span>Access your academic records</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                <span>Manage course enrollments</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                <span>Stay updated with campus events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-gray-600 dark:text-gray-400 hover:text-royal-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Card className="shadow-2xl">
              <CardHeader className="text-center pb-8">
                <div className="lg:hidden mx-auto mb-4 w-16 h-16 bg-royal-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="font-heading text-2xl">Sign In</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                    {error}
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
                
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <Link href="/forgot-password" className="text-royal-600 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                
                <div className="text-center text-sm pt-2">
                  <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
                  <Link href="/register" className="text-royal-600 hover:underline font-medium">
                    Create account
                  </Link>
                </div>
              </form>
            </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
