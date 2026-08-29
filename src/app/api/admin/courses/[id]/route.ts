import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getActor(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null

  const { userId } = verifyAccessToken(token)
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const actor = await getActor(request)
  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: { message: 'Super Admin access is required.' } }, { status: 403 })
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrollments: { take: 1 },
      },
    })

    if (!course) {
      return NextResponse.json({ error: { message: 'Course not found' } }, { status: 404 })
    }

    if (course.enrollments.length > 0) {
      return NextResponse.json(
        { error: { message: 'Cannot delete course with active enrollments' } },
        { status: 400 }
      )
    }

    await prisma.course.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: { message: 'Failed to delete course' } }, { status: 500 })
  }
}
