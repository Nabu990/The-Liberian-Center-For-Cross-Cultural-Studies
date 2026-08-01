import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

async function getSuperAdmin(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const { userId } = verifyAccessToken(token)
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } })
  return user?.role === 'SUPER_ADMIN' ? user : null
}

async function ensureTeacherProfile(userId: string) {
  const existing = await prisma.teacher.findUnique({ where: { userId } })
  if (existing) return existing
  const department = await prisma.department.findFirst({ orderBy: { createdAt: 'asc' }, select: { id: true } })
  if (!department) throw new Error('Create a department before assigning courses to teachers.')
  return prisma.teacher.create({ data: { userId, employeeId: `T-${userId.slice(-8).toUpperCase()}`, departmentId: department.id, specialization: [], qualification: 'Profile setup pending', experience: 0, hireDate: new Date() } })
}

export async function GET(request: NextRequest) {
  try {
    const actor = await getSuperAdmin(request)
    if (!actor) return NextResponse.json({ error: { message: 'Super Admin access is required.' } }, { status: 403 })
    const [courses, teachers] = await Promise.all([
      prisma.course.findMany({ orderBy: { code: 'asc' }, select: { id: true, code: true, name: true, description: true, semester: true, level: true, department: { select: { name: true } }, teacher: { select: { user: { select: { firstName: true, lastName: true } } } }, _count: { select: { enrollments: true } } } }),
      prisma.user.findMany({ where: { role: 'TEACHER', isActive: true }, orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }], select: { id: true, firstName: true, lastName: true, email: true, teacher: { select: { employeeId: true } } } }),
    ])
    return NextResponse.json({ courses, teachers })
  } catch (error) { console.error('Course assignment list error:', error); return NextResponse.json({ error: { message: 'Unable to load course assignments.' } }, { status: 500 }) }
}

export async function POST(request: NextRequest) {
  try {
    const actor = await getSuperAdmin(request)
    if (!actor) return NextResponse.json({ error: { message: 'Super Admin access is required.' } }, { status: 403 })
    const { courseId, teacherUserId } = await request.json() as { courseId?: string; teacherUserId?: string }
    if (!courseId || !teacherUserId) return NextResponse.json({ error: { message: 'Choose both a course and a teacher.' } }, { status: 400 })
    const teacherUser = await prisma.user.findFirst({ where: { id: teacherUserId, role: 'TEACHER', isActive: true }, select: { id: true } })
    if (!teacherUser) return NextResponse.json({ error: { message: 'The selected account is not an active teacher.' } }, { status: 400 })
    const [course, teacher] = await Promise.all([prisma.course.findUnique({ where: { id: courseId }, select: { id: true, code: true, name: true } }), ensureTeacherProfile(teacherUserId)])
    if (!course) return NextResponse.json({ error: { message: 'Course not found.' } }, { status: 404 })
    await prisma.course.update({ where: { id: course.id }, data: { teacherId: teacher.id } })
    await prisma.auditLog.create({ data: { userId: actor.id, action: 'COURSE_ASSIGNED_TO_TEACHER', entity: 'Course', entityId: course.id, details: JSON.stringify({ teacherUserId }) } })
    return NextResponse.json({ message: `${course.code} — ${course.name} has been assigned successfully.` })
  } catch (error) { console.error('Course assignment error:', error); return NextResponse.json({ error: { message: error instanceof Error ? error.message : 'Unable to assign the course.' } }, { status: 500 }) }
}
