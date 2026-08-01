import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (!token) {
    return NextResponse.json({ error: { message: 'Authentication is required.' } }, { status: 401 })
  }

  try {
    const { userId } = verifyAccessToken(token)
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        department: { select: { name: true } },
        enrollments: {
          orderBy: { enrolledAt: 'desc' },
          include: { course: { select: { id: true, code: true, name: true, description: true, credits: true, schedule: true, room: true, teacher: { select: { user: { select: { firstName: true, lastName: true } } } } } } },
        },
        studentGrades: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: { course: { select: { code: true, name: true } } },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { id: true, amount: true, description: true, status: true, dueDate: true, createdAt: true },
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 20,
          select: { id: true, date: true, status: true, remarks: true, courseId: true },
        },
        libraryBorrows: {
          orderBy: { borrowedAt: 'desc' },
          take: 20,
          select: { id: true, borrowedAt: true, dueDate: true, returnedAt: true, status: true, fine: true, book: { select: { title: true, author: true } } },
        },
        assignments: {
          orderBy: { submittedAt: 'desc' },
          take: 20,
          select: { id: true, submittedAt: true, grade: true, feedback: true, assignment: { select: { title: true, description: true, dueDate: true, maxPoints: true, fileUrl: true, course: { select: { code: true, name: true } } } } },
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: { message: 'Student profile not found.' } }, { status: 404 })
    }

    const outstandingFees = student.payments
      .filter((payment) => payment.status === 'PENDING' || payment.status === 'FAILED')
      .reduce((total, payment) => total + payment.amount, 0)
    const [notifications, availableCourses, attendanceCourses] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.course.findMany({
        where: { departmentId: student.departmentId, level: student.level, semester: student.semester, isActive: true },
        orderBy: { code: 'asc' },
        select: { id: true, code: true, name: true, credits: true, schedule: true, room: true },
      }),
      prisma.course.findMany({
        where: { id: { in: student.attendance.map((record) => record.courseId) } },
        select: { id: true, code: true, name: true },
      }),
    ])
    const courseById = new Map(attendanceCourses.map((course) => [course.id, course]))

    return NextResponse.json({
      student: {
        studentId: student.studentId,
        department: student.department.name,
        semester: student.semester,
        level: student.level,
        cgpa: student.cgpa,
        currentGPA: student.currentGPA,
        creditsEarned: student.creditsEarned,
        outstandingFees,
        enrollments: student.enrollments,
        grades: student.studentGrades,
        payments: student.payments,
        attendance: student.attendance.map(({ courseId, ...record }) => ({ ...record, course: courseById.get(courseId) || { code: 'Course', name: 'Unavailable' } })),
        libraryBorrows: student.libraryBorrows,
        assignments: student.assignments,
        availableCourses: availableCourses.filter((course) => !student.enrollments.some((enrollment) => enrollment.course.id === course.id)),
        notifications,
      },
    })
  } catch (error) {
    console.error('Student profile error:', error)
    return NextResponse.json({ error: { message: 'Unable to load the student profile.' } }, { status: 401 })
  }
}
