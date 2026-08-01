import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) return NextResponse.json({ error: { message: 'Authentication is required.' } }, { status: 401 })
    const { userId } = verifyAccessToken(token)
    const { id } = await params
    const notification = await prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } })
    if (!notification.count) return NextResponse.json({ error: { message: 'Notification not found.' } }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: { message: 'Unable to update the notification.' } }, { status: 500 })
  }
}
