import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

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

    // Get recent audit logs
    const auditLogs = await prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    // Format activity messages
    const activities = auditLogs.map(log => {
      const userName = `${log.user.firstName} ${log.user.lastName}`
      let message = ''

      switch (log.action) {
        case 'ROLE_UPDATED':
          message = `${userName} updated user role`
          break
        case 'USER_CREATED':
          message = `New user registered: ${log.user.email}`
          break
        case 'PAYMENT_RECEIVED':
          message = `Payment received from student`
          break
        case 'COURSE_CREATED':
          message = `Course created`
          break
        case 'SETTINGS_UPDATED':
          message = `System settings updated by ${userName}`
          break
        default:
          message = `${userName} performed ${log.action} on ${log.entity}`
      }

      return {
        id: log.id,
        message,
        action: log.action,
        entity: log.entity,
        createdAt: log.createdAt
      }
    })

    return NextResponse.json({ activities })
  } catch (error) {
    console.error('Dashboard activity error:', error)
    return NextResponse.json({ error: { message: 'Unable to load activity.' } }, { status: 500 })
  }
}
