import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

async function getStudent(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { userId, role } = verifyAccessToken(token)
  if (role !== 'STUDENT') return null
  return prisma.student.findUnique({ where: { userId } })
}

export async function POST(request: NextRequest) {
  try {
    const student = await getStudent(request)
    if (!student) return NextResponse.json({ error: { message: 'Student access is required.' } }, { status: 403 })

    const { action, courseId } = await request.json() as { action?: string; courseId?: string }
    if (action !== 'register' || !courseId) {
      return NextResponse.json({ error: { message: 'A valid course registration request is required.' } }, { status: 400 })
    }

    const course = await prisma.course.findFirst({
      where: { id: courseId, departmentId: student.departmentId, semester: student.semester, level: student.level, isActive: true },
      select: { id: true, code: true, name: true },
    })
    if (!course) return NextResponse.json({ error: { message: 'This course is not available for your current semester.' } }, { status: 404 })

    const academicYear = new Date().getFullYear()
    const enrollment = await prisma.enrollment.upsert({
      where: { studentId_courseId_semester_academicYear: { studentId: student.id, courseId, semester: student.semester, academicYear } },
      create: { studentId: student.id, courseId, semester: student.semester, academicYear },
      update: {},
    })

    return NextResponse.json({ enrollment, message: `${course.code} — ${course.name} has been added to your current courses.` })
  } catch (error) {
    console.error('Student service error:', error)
    return NextResponse.json({ error: { message: 'Unable to complete that service right now.' } }, { status: 500 })
  }
}
