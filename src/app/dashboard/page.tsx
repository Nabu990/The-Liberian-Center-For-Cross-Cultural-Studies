"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, DollarSign, Award, Users, FileText, Settings, FileCheck, Activity } from 'lucide-react'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { AdminUserManagement } from '@/components/dashboard/admin-user-management'
import { StudentAnnouncement } from '@/components/dashboard/student-announcement'
import { TeacherDashboard } from '@/components/dashboard/teacher-dashboard'
import { CourseAssignment } from '@/components/dashboard/course-assignment'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  activeStudents: number
  activeCourses: number
  monthlyRevenue: number
  activeTeachers: number
  departments: number
  pendingAdmissions: number
}

interface Activity {
  id: string
  message: string
  action: string
  entity: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    setStatsLoading(true)
    setStatsError('')

    try {
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/activity', { headers: { Authorization: `Bearer ${token}` } })
      ])

      const statsData = await statsResponse.json()
      const activityData = await activityResponse.json()

      if (!statsResponse.ok) throw new Error(statsData?.error?.message || 'Failed to load statistics')
      if (!activityResponse.ok) throw new Error(activityData?.error?.message || 'Failed to load activity')

      setStats(statsData)
      setActivities(activityData.activities || [])
    } catch (error) {
      setStatsError(error instanceof Error ? error.message : 'Failed to load dashboard data')
    } finally {
      setStatsLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard firstName={user.firstName} />
      case 'TEACHER':
        return <TeacherDashboard firstName={user.firstName} />
      case 'ADMIN':
      case 'SUPER_ADMIN':
        const isSuperAdmin = user.role === 'SUPER_ADMIN'
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold tracking-wide text-gold-600">{isSuperAdmin ? 'SYSTEM-WIDE ACCESS' : 'ADMINISTRATION'}</p>
              <h1 className="text-3xl font-bold font-heading">{isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isSuperAdmin ? 'You have complete system and role-management access.' : 'Manage students, teachers, and academic operations.'}
              </p>
            </div>

            {statsError && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md">
                {statsError}
              </div>
            )}

            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-royal-600" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? '...' : stats?.totalUsers.toLocaleString() || '0'}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Registered users</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gold-500" />
                    Students
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? '...' : stats?.activeStudents.toLocaleString() || '0'}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active students</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? '...' : stats?.activeCourses.toLocaleString() || '0'}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active courses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${statsLoading ? '...' : (stats?.monthlyRevenue || 0).toLocaleString()}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard/users" className="block">
                    <Button className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  {isSuperAdmin && (
                    <Link href="/dashboard/courses" className="block">
                      <Button className="w-full justify-start" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Manage Courses
                      </Button>
                    </Link>
                  )}
                  <Link href="/dashboard/reports" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <FileCheck className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </Link>
                  <Link href="/dashboard/audit" className="block">
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Audit Logs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <p className="text-sm text-gray-500">Loading activity...</p>
                  ) : activities.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {activities.map((activity) => (
                        <li key={activity.id} className="text-gray-600 dark:text-gray-400">
                          {activity.message}
                          <span className="block text-xs text-gray-400 mt-1">
                            {new Date(activity.createdAt).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <AdminUserManagement />

            {isSuperAdmin && <StudentAnnouncement />}

            {isSuperAdmin && <CourseAssignment />}

            {isSuperAdmin && (
              <Card className="border-gold-300 bg-gold-50/40 dark:bg-gold-950/10">
                <CardHeader>
                  <CardTitle>Super Admin Controls</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div><p className="font-semibold">Role management</p><p className="text-gray-600 dark:text-gray-400">Grant and remove privileged access.</p></div>
                  <div><p className="font-semibold">Audit trail</p><p className="text-gray-600 dark:text-gray-400">Review security-sensitive changes.</p></div>
                  <div><p className="font-semibold">System configuration</p><p className="text-gray-600 dark:text-gray-400">Manage institution-wide settings.</p></div>
                  <div><p className="font-semibold">Platform health</p><p className="text-gray-600 dark:text-gray-400">Monitor database and service status.</p></div>
                </CardContent>
              </Card>
            )}
          </div>
        )
      default:
        return (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}!</h1>
            <p className="text-gray-600 dark:text-gray-400">Your dashboard is being set up.</p>
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {getDashboardContent()}
    </div>
  )
}
