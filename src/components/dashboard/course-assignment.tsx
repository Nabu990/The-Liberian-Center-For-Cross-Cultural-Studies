"use client"

import { FormEvent, useEffect, useState } from 'react'
import { BookUser } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Course = { id: string; code: string; name: string; description: string; semester: number; level: number; department: { name: string }; teacher: { user: { firstName: string; lastName: string } } | null; _count: { enrollments: number } }
type Teacher = { id: string; firstName: string; lastName: string; email: string; teacher: { employeeId: string } | null }

export function CourseAssignment() {
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courseId, setCourseId] = useState('')
  const [teacherUserId, setTeacherUserId] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return
    try {
      const response = await fetch('/api/admin/course-assignments', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Unable to load courses.')
      setCourses(data.courses)
      setTeachers(data.teachers)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to load courses.')
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const token = localStorage.getItem('accessToken')
    if (!token) return
    setSaving(true)
    setStatus('')
    try {
      const response = await fetch('/api/admin/course-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId, teacherUserId })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Unable to assign the course.')
      setStatus(data.message)
      setCourseId('')
      setTeacherUserId('')
      await load()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to assign the course.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <BookUser className="h-4 w-4 md:h-5 md:w-5 text-royal-600" />
          Course-to-teacher assignment
        </CardTitle>
        <p className="text-xs md:text-sm text-gray-500">
          Assign an offered course to a teacher. Its registered students and assignment tools will appear in that teacher's workspace.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 grid-cols-1 md:grid-cols-[1fr_1fr_auto]" onSubmit={submit}>
          <select
            required
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-xs md:text-sm"
          >
            <option value="">Choose a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} · {course.name} ({course._count.enrollments} students) — {course.teacher ? `${course.teacher.user.firstName} ${course.teacher.user.lastName}` : 'Unassigned'}
              </option>
            ))}
          </select>
          <select
            required
            value={teacherUserId}
            onChange={(event) => setTeacherUserId(event.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-xs md:text-sm"
          >
            <option value="">Choose a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName} · {teacher.email}
              </option>
            ))}
          </select>
          <Button disabled={saving} className="text-xs md:text-sm">
            {saving ? 'Assigning…' : 'Assign course'}
          </Button>
        </form>
        {!courses.length && <p className="mt-3 text-xs md:text-sm text-amber-700">The course catalogue has not been added yet.</p>}
        {!teachers.length && <p className="mt-3 text-xs md:text-sm text-amber-700">No active Teacher accounts are available. Assign the Teacher role to an account first.</p>}
        {status && <p className={`mt-3 text-xs md:text-sm ${status.includes('successfully') ? 'text-emerald-700' : 'text-red-700'}`}>{status}</p>}
        <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="rounded-lg border p-3">
              <p className="font-semibold text-sm md:text-base">{course.code} · {course.name}</p>
              <p className="mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                {course.teacher ? `${course.teacher.user.firstName} ${course.teacher.user.lastName}` : 'Unassigned'}
              </p>
              <p className="mt-1 text-xs text-gray-500">{course._count.enrollments} students</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
