import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all enrollments
router.get('/', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        course: true,
      },
    })
    res.json({ enrollments })
  } catch (error) {
    console.error('Get enrollments error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get enrollment by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: true,
        grades: true,
      },
    })

    if (!enrollment) {
      return res.status(404).json({ error: { message: 'Enrollment not found' } })
    }

    res.json({ enrollment })
  } catch (error) {
    console.error('Get enrollment error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create enrollment
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { studentId, courseId, semester } = req.body

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        semester,
        status: 'ACTIVE',
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: true,
      },
    })

    res.status(201).json({ enrollment })
  } catch (error) {
    console.error('Create enrollment error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update enrollment status
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { status } = req.body

    const enrollment = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: true,
      },
    })

    res.json({ enrollment })
  } catch (error) {
    console.error('Update enrollment error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Delete enrollment
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    await prisma.enrollment.delete({ where: { id: req.params.id } })
    res.json({ message: 'Enrollment deleted successfully' })
  } catch (error) {
    console.error('Delete enrollment error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
