"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react'

interface Course {
  id: string
  code: string
  name: string
  description: string
  credits: number
  semester: number
  level: number
  room?: string
  isActive: boolean
  department: { name: string; code: string }
  teacher?: { user: { firstName: string; lastName: string } }
  program?: { name: string; code: string }
}

interface Department {
  id: string
  name: string
  code: string
}

interface Teacher {
  id: string
  user: { firstName: string; lastName: string }
}

interface Program {
  id: string
  name: string
  code: string
}

export default function CoursesPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    credits: '',
    departmentId: '',
    teacherId: '',
    programId: '',
    semester: '1',
    level: '1',
    room: '',
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (user && user.role === 'SUPER_ADMIN') {
      fetchCourses()
      fetchDepartments()
      fetchTeachers()
      fetchPrograms()
    }
  }, [user])

  const fetchCourses = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    setLoadingData(true)
    setError('')

    try {
      const response = await fetch('/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || 'Failed to load courses')
      setCourses(data.courses || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses')
    } finally {
      setLoadingData(false)
    }
  }

  const fetchDepartments = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      const response = await fetch('/api/admin/departments', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setDepartments(data.departments || [])
    } catch (err) {
      console.error('Failed to load departments:', err)
    }
  }

  const fetchTeachers = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      const response = await fetch('/api/admin/teachers', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setTeachers(data.teachers || [])
    } catch (err) {
      console.error('Failed to load teachers:', err)
    }
  }

  const fetchPrograms = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      const response = await fetch('/api/admin/programs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setPrograms(data.programs || [])
    } catch (err) {
      console.error('Failed to load programs:', err)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || 'Failed to create course')

      setShowAddForm(false)
      setFormData({
        code: '',
        name: '',
        description: '',
        credits: '',
        departmentId: '',
        teacherId: '',
        programId: '',
        semester: '1',
        level: '1',
        room: '',
      })
      fetchCourses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    const token = localStorage.getItem('accessToken')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data?.error?.message || 'Failed to delete course')

      fetchCourses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return <div className="flex items-center justify-center min-h-screen">Access Denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-royal-600" />
            <h1 className="text-2xl md:text-3xl font-bold font-heading">Course Management</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Add and manage courses</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Course Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Course Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="credits">Credits *</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Semester *</Label>
                  <select
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <select
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="departmentId">Department *</Label>
                  <select
                    id="departmentId"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="teacherId">Teacher</Label>
                  <select
                    id="teacherId"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.user.firstName} {teacher.user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="programId">Program</Label>
                  <select
                    id="programId"
                    value={formData.programId}
                    onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} ({program.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto">Create Course</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <p className="text-center text-gray-500 py-8">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No courses found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr className="text-xs md:text-sm text-gray-500">
                    <th className="p-2 md:p-4">Code</th>
                    <th className="p-2 md:p-4">Name</th>
                    <th className="p-2 md:p-4 hidden sm:table-cell">Department</th>
                    <th className="p-2 md:p-4 hidden md:table-cell">Teacher</th>
                    <th className="p-2 md:p-4 hidden sm:table-cell">Credits</th>
                    <th className="p-2 md:p-4 hidden sm:table-cell">Semester</th>
                    <th className="p-2 md:p-4 hidden sm:table-cell">Level</th>
                    <th className="p-2 md:p-4">Status</th>
                    <th className="p-2 md:p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-2 md:p-4 font-medium text-sm md:text-base">{course.code}</td>
                      <td className="p-2 md:p-4">
                        <p className="font-semibold text-sm md:text-base">{course.name}</p>
                        <p className="text-xs md:text-sm text-gray-500 truncate max-w-[120px] md:max-w-xs">{course.description}</p>
                      </td>
                      <td className="p-2 md:p-4 text-sm hidden sm:table-cell">{course.department.name}</td>
                      <td className="p-2 md:p-4 text-sm hidden md:table-cell">
                        {course.teacher ? `${course.teacher.user.firstName} ${course.teacher.user.lastName}` : '—'}
                      </td>
                      <td className="p-2 md:p-4 text-sm hidden sm:table-cell">{course.credits}</td>
                      <td className="p-2 md:p-4 text-sm hidden sm:table-cell">{course.semester}</td>
                      <td className="p-2 md:p-4 text-sm hidden sm:table-cell">{course.level}</td>
                      <td className="p-2 md:p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-2 md:p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
