"use client"

import { useEffect, useState } from 'react'
import { ShieldCheck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN'
interface ManagedUser { id: string; firstName: string; lastName: string; email: string; role: Role; isActive: boolean; createdAt: string; student: { studentId: string } | null }

const labels: Record<Role, string> = { STUDENT: 'Student', TEACHER: 'Teacher', ADMIN: 'Admin', SUPER_ADMIN: 'Super Admin' }

export function AdminUserManagement() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [actorRole, setActorRole] = useState<Role | null>(null)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data?.error?.message || 'Unable to load users.')
        setUsers(data.users)
        setActorRole(data.actorRole)
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Unable to load users.'))
  }, [])

  const updateRole = async (userId: string, role: Role) => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setSavingId(userId)
    setError('')
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, role }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Unable to update the role.')
      setUsers((current) => current.map((user) => user.id === userId ? { ...user, role: data.user.role } : user))
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update the role.')
    } finally {
      setSavingId(null)
    }
  }

  const availableRoles: Role[] = actorRole === 'SUPER_ADMIN' ? ['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'] : ['STUDENT', 'TEACHER']

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-royal-600" />User access management</CardTitle>
        <p className="text-sm text-gray-500">{actorRole === 'SUPER_ADMIN' ? 'You can manage all account roles.' : 'You can manage Student and Teacher roles.'}</p>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {!users.length && !error ? <p className="text-sm text-gray-500">Loading accounts…</p> : <div className="overflow-x-auto"><table className="w-full min-w-[42rem] text-left text-sm"><thead className="border-b text-gray-500"><tr><th className="p-3">User</th><th className="p-3">Student ID</th><th className="p-3">Current role</th><th className="p-3">Access</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b last:border-0"><td className="p-3"><p className="font-semibold">{user.firstName} {user.lastName}</p><p className="text-gray-500">{user.email}</p></td><td className="p-3">{user.student?.studentId || '—'}</td><td className="p-3">{labels[user.role]}</td><td className="p-3"><div className="flex items-center gap-2"><select className="h-9 rounded-md border border-input bg-background px-2" value={user.role} disabled={savingId === user.id} onChange={(event) => updateRole(user.id, event.target.value as Role)}>{availableRoles.map((role) => <option key={role} value={role}>{labels[role]}</option>)}</select>{savingId === user.id && <span className="text-gray-500">Saving…</span>}</div></td></tr>)}</tbody></table></div>}
      </CardContent>
    </Card>
  )
}
