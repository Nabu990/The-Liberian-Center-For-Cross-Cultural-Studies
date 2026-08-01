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
    const teachers = await prisma.teacher.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { user: { firstName: 'asc' } },
    })

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json({ error: { message: 'Failed to fetch teachers' } }, { status: 500 })
  }
}
