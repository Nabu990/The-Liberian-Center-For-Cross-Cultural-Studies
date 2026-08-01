import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

async function getTeacher(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { userId } = verifyAccessToken(token)
  // Use the current database role rather than the role embedded at login. This
  // allows an administrator's role change to take effect immediately.
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } })
  if (user?.role !== 'TEACHER') return null

  const existingProfile = await prisma.teacher.findUnique({ where: { userId } })
  if (existingProfile) return existingProfile

  // Accounts promoted to Teacher through user management need a profile before
  // they can own courses. Create a safe starter profile using the first department.
  const department = await prisma.department.findFirst({ orderBy: { createdAt: 'asc' }, select: { id: true } })
  if (!department) return null
  return prisma.teacher.create({
    data: {
      userId,
      employeeId: `T-${userId.slice(-8).toUpperCase()}`,
      departmentId: department.id,
      specialization: [],
      qualification: 'Profile setup pending',
      experience: 0,
      hireDate: new Date(),
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const teacher = await getTeacher(request)
    if (!teacher) return NextResponse.json({ error: { message: 'Teacher access is required.' } }, { status: 403 })
    const [courses, lessonPlans, todos, grades] = await Promise.all([
      prisma.course.findMany({ where: { teacherId: teacher.id }, orderBy: { code: 'asc' }, include: { enrollments: { include: { student: { select: { id: true, studentId: true, user: { select: { firstName: true, lastName: true, email: true } } } } } }, assignments: { orderBy: { dueDate: 'asc' }, include: { submissions: { include: { student: { select: { studentId: true, user: { select: { firstName: true, lastName: true } } } } } } } } } }),
      prisma.lessonPlan.findMany({ where: { teacherId: teacher.id }, orderBy: [{ plannedDate: 'asc' }, { createdAt: 'desc' }], include: { course: { select: { code: true, name: true } } } }),
      prisma.teacherTodo.findMany({ where: { teacherId: teacher.id }, orderBy: [{ isCompleted: 'asc' }, { dueDate: 'asc' }, { createdAt: 'desc' }] }),
      prisma.studentGrade.findMany({ where: { course: { teacherId: teacher.id } }, select: { id: true, grade: true, gradePoint: true, credits: true, courseId: true, student: { select: { studentId: true, user: { select: { firstName: true, lastName: true } } } } } }),
    ])
    const courseSummaries = courses.map((course) => ({ id: course.id, code: course.code, name: course.name, credits: course.credits, schedule: course.schedule, room: course.room, enrollmentCount: course.enrollments.length, assignmentCount: course.assignments.length, pendingSubmissions: course.assignments.reduce((total, assignment) => total + assignment.submissions.filter((submission) => submission.grade === null).length, 0) }))
    const averageGradePoint = grades.length ? grades.reduce((total, grade) => total + grade.gradePoint, 0) / grades.length : 0
    return NextResponse.json({ teacher: { employeeId: teacher.employeeId, courses, courseSummaries, lessonPlans, todos, grades, analytics: { totalStudents: new Set(courses.flatMap((course) => course.enrollments.map((enrollment) => enrollment.studentId))).size, gradedRecords: grades.length, averageGradePoint } } })
  } catch (error) { console.error('Teacher dashboard error:', error); return NextResponse.json({ error: { message: 'Unable to load the teacher dashboard.' } }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const teacher = await getTeacher(request)
    if (!teacher) return NextResponse.json({ error: { message: 'Teacher access is required.' } }, { status: 403 })
    const body = await request.json() as Record<string, unknown>
    if (body.action === 'createTodo') {
      const title = typeof body.title === 'string' ? body.title.trim() : ''
      if (!title) return NextResponse.json({ error: { message: 'Enter a task title.' } }, { status: 400 })
      await prisma.teacherTodo.create({ data: { teacherId: teacher.id, title, dueDate: typeof body.dueDate === 'string' && body.dueDate ? new Date(body.dueDate) : null } })
    } else if (body.action === 'createAssignment' || body.action === 'createLessonPlan') {
      const courseId = typeof body.courseId === 'string' ? body.courseId : ''
      const course = await prisma.course.findFirst({ where: { id: courseId, teacherId: teacher.id }, select: { id: true } })
      if (!course) return NextResponse.json({ error: { message: 'Choose one of your classes.' } }, { status: 400 })
      const title = typeof body.title === 'string' ? body.title.trim() : ''
      if (!title) return NextResponse.json({ error: { message: 'Enter a title.' } }, { status: 400 })
      if (body.action === 'createAssignment') {
        const description = typeof body.description === 'string' ? body.description.trim() : ''
        const dueDate = typeof body.dueDate === 'string' ? new Date(body.dueDate) : null
        const maxPoints = Number(body.maxPoints)
        if (!description || !dueDate || Number.isNaN(dueDate.getTime()) || !Number.isFinite(maxPoints) || maxPoints <= 0) return NextResponse.json({ error: { message: 'Add a description, valid due date, and points.' } }, { status: 400 })
        await prisma.assignment.create({ data: { teacherId: teacher.id, courseId, title, description, dueDate, maxPoints, fileUrl: typeof body.fileUrl === 'string' && body.fileUrl.trim() ? body.fileUrl.trim() : null } })
      } else {
        const objectives = typeof body.objectives === 'string' ? body.objectives.trim() : ''
        const content = typeof body.content === 'string' ? body.content.trim() : ''
        if (!objectives || !content) return NextResponse.json({ error: { message: 'Add learning objectives and lesson content.' } }, { status: 400 })
        await prisma.lessonPlan.create({ data: { teacherId: teacher.id, courseId, title, objectives, content, week: Number.isFinite(Number(body.week)) && Number(body.week) > 0 ? Number(body.week) : null, plannedDate: typeof body.plannedDate === 'string' && body.plannedDate ? new Date(body.plannedDate) : null } })
      }
    } else return NextResponse.json({ error: { message: 'Unknown teacher action.' } }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (error) { console.error('Teacher action error:', error); return NextResponse.json({ error: { message: 'Unable to save your changes.' } }, { status: 500 }) }
}

export async function PATCH(request: NextRequest) {
  try {
    const teacher = await getTeacher(request)
    if (!teacher) return NextResponse.json({ error: { message: 'Teacher access is required.' } }, { status: 403 })
    const body = await request.json() as { action?: string; todoId?: string; submissionId?: string; completed?: boolean; grade?: number; feedback?: string }
    if (body.action === 'toggleTodo' && body.todoId) await prisma.teacherTodo.updateMany({ where: { id: body.todoId, teacherId: teacher.id }, data: { isCompleted: Boolean(body.completed) } })
    else if (body.action === 'gradeSubmission' && body.submissionId && typeof body.grade === 'number') {
      const submission = await prisma.assignmentSubmission.findFirst({ where: { id: body.submissionId, assignment: { teacherId: teacher.id } }, select: { id: true } })
      if (!submission) return NextResponse.json({ error: { message: 'Submission not found.' } }, { status: 404 })
      await prisma.assignmentSubmission.update({ where: { id: submission.id }, data: { grade: body.grade, feedback: body.feedback?.trim() || null, gradedAt: new Date() } })
    } else return NextResponse.json({ error: { message: 'Invalid update request.' } }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (error) { console.error('Teacher update error:', error); return NextResponse.json({ error: { message: 'Unable to update the item.' } }, { status: 500 }) }
}
