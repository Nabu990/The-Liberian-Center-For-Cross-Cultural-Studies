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

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get total users
    const totalUsers = await prisma.user.count()

    // Get active students
    const activeStudents = await prisma.student.count({
      where: { isActive: true }
    })

    // Get active courses
    const activeCourses = await prisma.course.count({
      where: { isActive: true }
    })

    // Get revenue for current month (completed payments)
    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        paidAt: { gte: startOfMonth }
      },
      select: { amount: true }
    })

    const monthlyRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0)

    // Get teacher count
    const activeTeachers = await prisma.teacher.count({
      where: { isActive: true }
    })

    // Get department count
    const departments = await prisma.department.count()

    // Get pending admissions
    const pendingAdmissions = await prisma.admission.count({
      where: { status: 'PENDING' }
    })

    return NextResponse.json({
      totalUsers,
      activeStudents,
      activeCourses,
      monthlyRevenue,
      activeTeachers,
      departments,
      pendingAdmissions
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ error: { message: 'Unable to load statistics.' } }, { status: 500 })
  }
}
