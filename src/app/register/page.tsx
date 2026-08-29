"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Chrome } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    semester: '1',
    level: '1',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error?.message || 'Registration failed')
      }

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setGoogleLoading(true)

    try {
      const response = await fetch('/api/auth/google')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error?.message || 'Failed to initialize Google OAuth')
      }

      window.location.href = data.authUrl
    } catch (err: any) {
      setError(err.message)
      setGoogleLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600">
      <div className="min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 bg-royal-900/50">
          <div className="max-w-lg">
            <div className="flex items-center space-x-3 mb-8">
              <Image 
                src="/images/LCCS-logo.png" 
                alt="LCCCS Logo" 
                width={48} 
                height={48}
                className="h-12 w-12"
              />
              <span className="text-3xl font-bold font-heading text-white">LCCCS</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6 font-heading">
              Join Our Community
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Create your account and begin your educational journey at the Liberian Center for Cross Cultural Studies. Access world-class education and connect with a diverse community of learners.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                <span>Enroll in cross-cultural programs</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                <span>Access academic resources</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                <span>Connect with faculty and peers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
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
                  <Image 
                    src="/images/LCCS-logo.png" 
                    alt="LCCCS Logo" 
                    width={32} 
                    height={32}
                    className="h-8 w-8"
                  />
                </div>
                <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
                <CardDescription>Fill in your details to get started</CardDescription>
              </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number <span className="text-gray-500">(optional)</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+231 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="semester" className="text-sm font-medium">Semester</Label>
                    <select
                      id="semester"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    >
                      <option value="1">Semester 1</option>
                      <option value="2">Semester 2</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="level" className="text-sm font-medium">Level</Label>
                    <select
                      id="level"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    >
                      <option value="1">Level 1</option>
                      <option value="2">Level 2</option>
                      <option value="3">Level 3</option>
                      <option value="4">Level 4</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-md bg-royal-50 p-3 text-sm text-royal-800 dark:bg-royal-950/40 dark:text-royal-200">
                  You will be enrolled in Cross Cultural Studies. Your Student ID is generated automatically after registration.
                </div>

                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading}
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  {googleLoading ? 'Connecting...' : 'Sign up with Google'}
                </Button>

                <div className="text-center text-sm pt-2">
                  <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
                  <Link href="/login" className="text-royal-600 hover:underline font-medium">
                    Sign in
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
