import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get dashboard statistics
router.get('/stats', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.course.count(),
      prisma.enrollment.count(),
      prisma.payment.count(),
    ])

    const stats = {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      totalPayments,
    }

    res.json({ stats })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get system settings
router.get('/settings', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst()
    res.json({ settings })
  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update system settings
router.put('/settings', authenticate, authorize('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { schoolName, schoolAddress, schoolPhone, schoolEmail, academicYear } = req.body

    const settings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {
        schoolName,
        schoolAddress,
        schoolPhone,
        schoolEmail,
        academicYear,
      },
      create: {
        id: 'default',
        schoolName,
        schoolAddress,
        schoolPhone,
        schoolEmail,
        academicYear,
      },
    })

    res.json({ settings })
  } catch (error) {
    console.error('Update settings error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get audit logs
router.get('/audit-logs', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
    res.json({ logs })
  } catch (error) {
    console.error('Get audit logs error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
