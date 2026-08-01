"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Filter, ShieldCheck } from 'lucide-react'

type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN' | 'REGISTRAR' | 'FINANCE_OFFICER' | 'LIBRARIAN' | 'VISITOR'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  isActive: boolean
  createdAt: string
  student?: { studentId: string }
  teacher?: { employeeId: string }
}

const roleLabels: Record<Role, string> = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
  REGISTRAR: 'Registrar',
  FINANCE_OFFICER: 'Finance Officer',
  LIBRARIAN: 'Librarian',
  VISITOR: 'Visitor'
}

const roleColors: Record<Role, string> = {
  STUDENT: 'bg-blue-100 text-blue-800',
  TEACHER: 'bg-green-100 text-green-800',
  ADMIN: 'bg-purple-100 text-purple-800',
  SUPER_ADMIN: 'bg-red-100 text-red-800',
  REGISTRAR: 'bg-yellow-100 text-yellow-800',
  FINANCE_OFFICER: 'bg-orange-100 text-orange-800',
  LIBRARIAN: 'bg-pink-100 text-pink-800',
  VISITOR: 'bg-gray-100 text-gray-800'
}

export default function UsersPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      fetchUsers()
    }
  }, [user])

  useEffect(() => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, users])

  const fetchUsers = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    setLoadingUsers(true)
    setError('')

    try {
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || 'Failed to load users')
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoadingUsers(false)
    }
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
          <Users className="h-8 w-8 text-royal-600" />
          <h1 className="text-3xl font-bold font-heading">User Management</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Manage all users in the system</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-royal-600" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as Role | 'ALL')}
              className="h-10 px-4 rounded-md border border-input bg-background"
            >
              <option value="ALL">All Roles</option>
              {Object.entries(roleLabels).map(([role, label]) => (
                <option key={role} value={role}>{label}</option>
              ))}
            </select>
          </div>

          {loadingUsers ? (
            <p className="text-center text-gray-500 py-8">Loading users...</p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr className="text-sm text-gray-500">
                    <th className="p-4">User</th>
                    <th className="p-4">ID</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">
                        <p className="font-semibold">{u.firstName} {u.lastName}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </td>
                      <td className="p-4 text-sm">
                        {u.student?.studentId || u.teacher?.employeeId || '—'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                          {roleLabels[u.role]}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
