"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileCheck, Download, Users, BookOpen, DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface ReportData {
  totalUsers: number
  activeStudents: number
  activeCourses: number
  monthlyRevenue: number
  activeTeachers: number
  departments: number
  pendingAdmissions: number
}

export default function ReportsPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<ReportData | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    setLoadingStats(true)
    setError('')

    try {
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || 'Failed to load reports')
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports')
    } finally {
      setLoadingStats(false)
    }
  }

  const generateReport = (type: string) => {
    // In a real implementation, this would generate and download a PDF/Excel report
    alert(`Generating ${type} report...`)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileCheck className="h-8 w-8 text-royal-600" />
          <h1 className="text-3xl font-bold font-heading">Reports</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">View and generate institutional reports</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-royal-600" />
              User Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Comprehensive user statistics and demographics
            </p>
            <Button onClick={() => generateReport('users')} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gold-500" />
              Academic Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Course enrollment, grades, and academic performance
            </p>
            <Button onClick={() => generateReport('academic')} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Financial Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Revenue, payments, and financial summaries
            </p>
            <Button onClick={() => generateReport('financial')} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Admission Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Application statistics and admission trends
            </p>
            <Button onClick={() => generateReport('admission')} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Attendance Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Student and teacher attendance records
            </p>
            <Button onClick={() => generateReport('attendance')} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-orange-500" />
              Custom Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create custom reports with specific criteria
            </p>
            <Button onClick={() => generateReport('custom')} className="w-full" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <p className="text-center text-gray-500 py-8">Loading statistics...</p>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-royal-600">{stats.totalUsers}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gold-500">{stats.activeStudents}</div>
                <div className="text-sm text-gray-500">Active Students</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{stats.activeCourses}</div>
                <div className="text-sm text-gray-500">Active Courses</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">${stats.monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Monthly Revenue</div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
