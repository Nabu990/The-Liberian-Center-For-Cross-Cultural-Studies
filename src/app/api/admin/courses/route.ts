import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getActor(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null

  const { userId } = verifyAccessToken(token)
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } })
}

export async function GET(request: NextRequest) {
  const actor = await getActor(request)
  if (!actor || !['ADMIN', 'SUPER_ADMIN'].includes(actor.role)) {
    return NextResponse.json({ error: { message: 'Administrator access is required.' } }, { status: 403 })
  }

  try {
    const courses = await prisma.course.findMany({
      include: {
        department: { select: { name: true, code: true } },
        teacher: { select: { user: { select: { firstName: true, lastName: true } } } },
        program: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: { message: 'Failed to fetch courses' } }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const actor = await getActor(request)
  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: { message: 'Super Admin access is required.' } }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { code, name, description, credits, departmentId, teacherId, programId, semester, level, schedule, room } = body

    if (!code || !name || !description || !credits || !departmentId || !semester || !level) {
      return NextResponse.json({ error: { message: 'Missing required fields' } }, { status: 400 })
    }

    const existingCourse = await prisma.course.findUnique({ where: { code } })
    if (existingCourse) {
      return NextResponse.json({ error: { message: 'Course code already exists' } }, { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        code,
        name,
        description,
        credits: parseInt(credits),
        departmentId,
        teacherId: teacherId || null,
        programId: programId || null,
        semester: parseInt(semester),
        level: parseInt(level),
        schedule: schedule || null,
        room: room || null,
      },
      include: {
        department: { select: { name: true, code: true } },
        teacher: { select: { user: { select: { firstName: true, lastName: true } } } },
        program: { select: { name: true, code: true } },
      },
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: { message: 'Failed to create course' } }, { status: 500 })
  }
}
