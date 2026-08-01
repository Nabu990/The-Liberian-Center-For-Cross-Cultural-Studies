import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) return NextResponse.json({ error: { message: 'Authentication is required.' } }, { status: 401 })
    const { userId, role } = verifyAccessToken(token)
    if (role !== 'SUPER_ADMIN') return NextResponse.json({ error: { message: 'Only a Super Admin can send student announcements.' } }, { status: 403 })
    const { title, message, type = 'INFO' } = await request.json() as { title?: string; message?: string; type?: string }
    if (!title?.trim() || !message?.trim() || !['INFO', 'WARNING', 'SUCCESS', 'ERROR'].includes(type)) {
      return NextResponse.json({ error: { message: 'Enter a title, message, and valid notification type.' } }, { status: 400 })
    }
    const students = await prisma.user.findMany({ where: { role: 'STUDENT', isActive: true }, select: { id: true } })
    if (!students.length) return NextResponse.json({ error: { message: 'There are no active student accounts to notify.' } }, { status: 400 })
    await prisma.$transaction([
      prisma.notification.createMany({ data: students.map((student) => ({ userId: student.id, title: title.trim(), message: message.trim(), type })) }),
      prisma.auditLog.create({ data: { userId, action: 'STUDENT_ANNOUNCEMENT_SENT', entity: 'Notification', details: JSON.stringify({ title: title.trim(), recipients: students.length }) } }),
    ])
    return NextResponse.json({ message: `Announcement sent to ${students.length} student${students.length === 1 ? '' : 's'}.` })
  } catch (error) {
    console.error('Student announcement error:', error)
    return NextResponse.json({ error: { message: 'Unable to send the announcement.' } }, { status: 500 })
  }
}
