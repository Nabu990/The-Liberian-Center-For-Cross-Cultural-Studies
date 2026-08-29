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
    const settings = await prisma.systemSettings.findMany()
    
    // Convert array of settings to object with key-value pairs
    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)
    
    res.json({ settings: settingsObject })
  } catch (error) {
    console.error('Get settings error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update system settings
router.put('/settings', authenticate, authorize('SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { schoolName, schoolAddress, schoolPhone, schoolEmail, academicYear } = req.body

    // Update multiple settings as key-value pairs
    const settings = await Promise.all([
      prisma.systemSettings.upsert({
        where: { key: 'schoolName' },
        update: { value: schoolName },
        create: { key: 'schoolName', value: schoolName, description: 'School name' },
      }),
      prisma.systemSettings.upsert({
        where: { key: 'schoolAddress' },
        update: { value: schoolAddress },
        create: { key: 'schoolAddress', value: schoolAddress, description: 'School address' },
      }),
      prisma.systemSettings.upsert({
        where: { key: 'schoolPhone' },
        update: { value: schoolPhone },
        create: { key: 'schoolPhone', value: schoolPhone, description: 'School phone number' },
      }),
      prisma.systemSettings.upsert({
        where: { key: 'schoolEmail' },
        update: { value: schoolEmail },
        create: { key: 'schoolEmail', value: schoolEmail, description: 'School email' },
      }),
      prisma.systemSettings.upsert({
        where: { key: 'academicYear' },
        update: { value: academicYear },
        create: { key: 'academicYear', value: academicYear, description: 'Current academic year' },
      }),
    ])

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
