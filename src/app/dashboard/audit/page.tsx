"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Activity, Search, Filter, Download, AlertTriangle } from 'lucide-react'

interface AuditLog {
  id: string
  userId: string
  action: string
  entity: string
  entityId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

export default function AuditPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      fetchAuditLogs()
    }
  }, [user])

  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${log.user.firstName} ${log.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (actionFilter !== 'ALL') {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    setFilteredLogs(filtered)
  }, [searchTerm, actionFilter, logs])

  const fetchAuditLogs = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    setLoadingLogs(true)
    setError('')

    try {
      const response = await fetch('/api/admin/activity', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || 'Failed to load audit logs')
      
      // Transform activity data to audit log format
      const auditLogs = (data.activities || []).map((activity: any) => ({
        id: activity.id,
        userId: activity.userId || '',
        action: activity.action,
        entity: activity.entity,
        createdAt: activity.createdAt,
        user: {
          firstName: 'System',
          lastName: 'User',
          email: 'system@lcccs.edu'
        }
      }))
      
      setLogs(auditLogs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs')
    } finally {
      setLoadingLogs(false)
    }
  }

  const exportLogs = () => {
    // In a real implementation, this would export to CSV/PDF
    alert('Exporting audit logs...')
  }

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      'ROLE_UPDATED': 'bg-purple-100 text-purple-800',
      'USER_CREATED': 'bg-blue-100 text-blue-800',
      'PAYMENT_RECEIVED': 'bg-green-100 text-green-800',
      'COURSE_CREATED': 'bg-yellow-100 text-yellow-800',
      'SETTINGS_UPDATED': 'bg-orange-100 text-orange-800',
      'USER_DELETED': 'bg-red-100 text-red-800',
    }
    return colors[action] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>
  }

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-8 w-8 text-royal-600" />
          <h1 className="text-3xl font-bold font-heading">Audit Logs</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">View system activity and security events</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-royal-600" />
            System Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="h-10 px-4 rounded-md border border-input bg-background"
            >
              <option value="ALL">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
            <Button onClick={exportLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {loadingLogs ? (
            <p className="text-center text-gray-500 py-8">Loading audit logs...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No audit logs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr className="text-sm text-gray-500">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold">{log.user.firstName} {log.user.lastName}</p>
                        <p className="text-sm text-gray-500">{log.user.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{log.entity}</td>
                      <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                        {log.details || '—'}
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
