"use client"

import { useEffect, useState } from 'react'
import { Award, Bell, BookOpen, Check, CreditCard, Library, Loader2, ReceiptText, UserCheck, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface StudentDashboardProps { firstName: string }
type Course = { id: string; code: string; name: string; description?: string; credits: number; schedule: string | null; room?: string | null; teacher?: { user: { firstName: string; lastName: string } } }
interface StudentProfile {
  studentId: string; department: string; semester: number; level: number; cgpa: number; currentGPA: number; creditsEarned: number; outstandingFees: number
  enrollments: Array<{ id: string; course: Course }>
  grades: Array<{ id: string; grade: string; gradePoint: number; course: { code: string; name: string } }>
  payments: Array<{ id: string; amount: number; description: string; status: string; dueDate: string | null; createdAt: string }>
  attendance: Array<{ id: string; date: string; status: string; remarks: string | null; course: { code: string; name: string } }>
  libraryBorrows: Array<{ id: string; borrowedAt: string; dueDate: string; returnedAt: string | null; status: string; fine: number; book: { title: string; author: string } }>
  assignments: Array<{ id: string; submittedAt: string; grade: number | null; feedback: string | null; assignment: { title: string; description: string; dueDate: string; maxPoints: number; fileUrl: string | null; course: { code: string; name: string } } }>
  availableCourses: Course[]
  notifications: Array<{ id: string; title: string; message: string; type: string; isRead: boolean; createdAt: string }>
}

const formatDate = (date: string) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export function StudentDashboard({ firstName }: StudentDashboardProps) {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [error, setError] = useState('')
  const [activeService, setActiveService] = useState<'transcript' | 'registration' | 'attendance' | 'library' | 'payments' | 'materials' | null>(null)
  const [savingCourse, setSavingCourse] = useState<string | null>(null)

  const loadProfile = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    try {
      const response = await fetch('/api/students/me', { headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Unable to load your dashboard.')
      setProfile(data.student)
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to load your dashboard.') }
  }

  useEffect(() => { loadProfile() }, [])

  const markRead = async (id: string) => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    const response = await fetch(`/api/students/notifications/${id}`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
    if (response.ok) setProfile((current) => current ? { ...current, notifications: current.notifications.map((notice) => notice.id === id ? { ...notice, isRead: true } : notice) } : current)
  }

  const register = async (courseId: string) => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setSavingCourse(courseId); setError('')
    try {
      const response = await fetch('/api/students/services', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ action: 'register', courseId }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Unable to register for this course.')
      await loadProfile()
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to register for this course.') } finally { setSavingCourse(null) }
  }

  if (error && !profile) return <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>
  if (!profile) return <p className="py-12 text-center text-gray-500">Loading your student dashboard…</p>

  const stats = [
    { label: 'CGPA', value: profile.cgpa.toFixed(2), icon: Award, tone: 'text-gold-600' }, { label: 'Current GPA', value: profile.currentGPA.toFixed(2), icon: Award, tone: 'text-royal-600' },
    { label: 'Credits Earned', value: String(profile.creditsEarned), icon: BookOpen, tone: 'text-emerald-600' }, { label: 'Outstanding Fees', value: `US$${profile.outstandingFees.toLocaleString()}`, icon: Wallet, tone: 'text-red-600' },
  ]
  const services = [
    ['transcript', 'Transcript', ReceiptText], ['registration', 'Course registration', BookOpen], ['attendance', 'Attendance', UserCheck], ['library', 'Library books', Library], ['payments', 'Payment history', CreditCard], ['materials', 'Course materials', BookOpen],
  ] as const

  const serviceContent = () => {
    if (activeService === 'transcript') return profile.grades.length ? <ul className="space-y-2">{profile.grades.map((grade) => <li key={grade.id} className="flex justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"><span>{grade.course.code} · {grade.course.name}</span><strong>{grade.grade}</strong></li>)}</ul> : <p className="text-sm text-gray-500">Your official grades will appear here after approval.</p>
    if (activeService === 'registration') return profile.availableCourses.length ? <ul className="space-y-3">{profile.availableCourses.map((course) => <li key={course.id} className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{course.code} · {course.name}</p><p className="text-sm text-gray-500">{course.credits} credits{course.schedule ? ` · ${course.schedule}` : ''}</p></div><Button size="sm" disabled={savingCourse === course.id} onClick={() => register(course.id)}>{savingCourse === course.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Register</Button></li>)}</ul> : <p className="text-sm text-gray-500">You are registered for all courses currently available to your level and semester.</p>
    if (activeService === 'attendance') return profile.attendance.length ? <ul className="space-y-2">{profile.attendance.map((record) => <li key={record.id} className="flex justify-between rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800"><span><strong>{record.course.code}</strong> · {formatDate(record.date)}</span><span className="font-semibold">{record.status}</span></li>)}</ul> : <p className="text-sm text-gray-500">No attendance records have been posted yet.</p>
    if (activeService === 'library') return profile.libraryBorrows.length ? <ul className="space-y-2">{profile.libraryBorrows.map((borrow) => <li key={borrow.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800"><p className="font-semibold">{borrow.book.title}</p><p className="text-gray-500">{borrow.book.author} · Due {formatDate(borrow.dueDate)} · {borrow.status}</p></li>)}</ul> : <p className="text-sm text-gray-500">You have no library borrowing records.</p>
    if (activeService === 'payments') return profile.payments.length ? <ul className="space-y-2">{profile.payments.map((payment) => <li key={payment.id} className="flex justify-between rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800"><span><strong>{payment.description}</strong><span className="block text-gray-500">{formatDate(payment.createdAt)}</span></span><span className="text-right"><strong>US${payment.amount.toLocaleString()}</strong><span className="block text-gray-500">{payment.status}</span></span></li>)}</ul> : <p className="text-sm text-gray-500">No payment records are available.</p>
    if (activeService === 'materials') return profile.assignments.length ? <ul className="space-y-3">{profile.assignments.map((item) => <li key={item.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800"><p className="font-semibold">{item.assignment.course.code} · {item.assignment.title}</p><p className="mt-1 text-gray-500">Due {formatDate(item.assignment.dueDate)} · {item.assignment.description}</p>{item.assignment.fileUrl && <a className="mt-2 inline-block text-royal-600 underline" href={item.assignment.fileUrl} target="_blank">Open material</a>}</li>)}</ul> : <p className="text-sm text-gray-500">No course materials have been shared yet.</p>
    return null
  }

  return <div className="space-y-6">
    <section className="rounded-2xl bg-gradient-to-br from-royal-900 via-royal-700 to-royal-600 p-6 text-white shadow-lg sm:p-8"><p className="text-sm font-medium text-gold-300">STUDENT DASHBOARD</p><h1 className="mt-2 text-3xl font-bold font-heading">Welcome back, {firstName}.</h1><div className="mt-6 grid gap-3 text-sm sm:grid-cols-3"><p><span className="text-royal-200">Student ID</span><br /><strong>{profile.studentId}</strong></p><p><span className="text-royal-200">Concentration</span><br /><strong>{profile.department}</strong></p><p><span className="text-royal-200">Academic standing</span><br /><strong>Level {profile.level} · Semester {profile.semester}</strong></p></div></section>
    {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon, tone }) => <Card key={label}><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div><Icon className={`h-7 w-7 ${tone}`} /></CardContent></Card>)}</section>
    <section className="grid gap-6 lg:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-royal-600" />Current Courses</CardTitle></CardHeader><CardContent>{profile.enrollments.length ? <ul className="space-y-3">{profile.enrollments.map(({ id, course }) => <li key={id} className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800"><p className="font-semibold">{course.code} · {course.name}</p><p className="mt-1 text-sm text-gray-500">{course.credits} credits{course.schedule ? ` · ${course.schedule}` : ''}{course.room ? ` · Room ${course.room}` : ''}</p>{course.teacher && <p className="mt-1 text-sm text-gray-500">Instructor: {course.teacher.user.firstName} {course.teacher.user.lastName}</p>}</li>)}</ul> : <p className="text-sm text-gray-500">No courses are registered for this semester yet.</p>}</CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-royal-600" />Notifications</CardTitle></CardHeader><CardContent>{profile.notifications.length ? <ul className="space-y-3">{profile.notifications.map((notice) => <li key={notice.id} className={`rounded-lg p-3 ${notice.isRead ? 'bg-gray-50 dark:bg-gray-800' : 'border border-royal-200 bg-royal-50 dark:bg-royal-950/30'}`}><div className="flex gap-3"><div className="flex-1"><p className="font-semibold">{notice.title}</p><p className="text-sm text-gray-600 dark:text-gray-300">{notice.message}</p><p className="mt-1 text-xs text-gray-500">{formatDate(notice.createdAt)}</p></div>{!notice.isRead && <Button size="sm" variant="outline" onClick={() => markRead(notice.id)}><Check className="mr-1 h-4 w-4" />Read</Button>}</div></li>)}</ul> : <p className="text-sm text-gray-500">You have no notifications.</p>}</CardContent></Card>
    </section>
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-royal-600" />Student Services</CardTitle><p className="text-sm font-normal text-gray-500">Select a service to view and manage your records.</p></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{services.map(([key, label, Icon]) => <Button key={key} variant={activeService === key ? 'default' : 'outline'} className="justify-start" onClick={() => setActiveService(key)}><Icon className="mr-2 h-4 w-4" />{label}</Button>)}</div>{activeService && <div className="mt-5 rounded-xl border p-4"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{services.find(([key]) => key === activeService)?.[1]}</h3><Button variant="ghost" size="sm" onClick={() => setActiveService(null)}>Close</Button></div>{serviceContent()}</div>}</CardContent></Card>
  </div>
}
