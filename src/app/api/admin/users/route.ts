import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const roles = ['STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'] as const
type ManagedRole = (typeof roles)[number]

async function getActor(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null

  const { userId } = verifyAccessToken(token)
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } })
}

export async function GET(request: NextRequest) {
  try {
    const actor = await getActor(request)
    if (!actor || !['ADMIN', 'SUPER_ADMIN'].includes(actor.role)) {
      return NextResponse.json({ error: { message: 'Administrator access is required.' } }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        student: { select: { studentId: true } },
      },
    })

    const visibleUsers = actor.role === 'SUPER_ADMIN'
      ? users
      : users.filter((user) => user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')

    return NextResponse.json({ users: visibleUsers, actorRole: actor.role })
  } catch (error) {
    console.error('Admin user list error:', error)
    return NextResponse.json({ error: { message: 'Unable to load users.' } }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const actor = await getActor(request)
    if (!actor || !['ADMIN', 'SUPER_ADMIN'].includes(actor.role)) {
      return NextResponse.json({ error: { message: 'Administrator access is required.' } }, { status: 403 })
    }

    const { userId, role } = await request.json() as { userId?: string; role?: ManagedRole }
    if (!userId || !role || !roles.includes(role)) {
      return NextResponse.json({ error: { message: 'A valid user and role are required.' } }, { status: 400 })
    }

    const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } })
    if (!target) {
      return NextResponse.json({ error: { message: 'User not found.' } }, { status: 404 })
    }

    const isSuperAdminAction = role === 'ADMIN' || role === 'SUPER_ADMIN' || target.role === 'ADMIN' || target.role === 'SUPER_ADMIN'
    if (actor.role !== 'SUPER_ADMIN' && isSuperAdminAction) {
      return NextResponse.json({ error: { message: 'Only a Super Admin can manage Admin roles.' } }, { status: 403 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, isActive: true, createdAt: true },
    })

    await prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: 'ROLE_UPDATED',
        entity: 'User',
        entityId: target.id,
        details: JSON.stringify({ previousRole: target.role, newRole: role }),
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Admin role update error:', error)
    return NextResponse.json({ error: { message: 'Unable to update the user role.' } }, { status: 500 })
  }
}
