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
    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ departments })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json({ error: { message: 'Failed to fetch departments' } }, { status: 500 })
  }
}
