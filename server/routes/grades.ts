import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all grades
router.get('/', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        enrollment: {
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
        },
      },
    })
    res.json({ grades })
  } catch (error) {
    console.error('Get grades error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get grade by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const grade = await prisma.grade.findUnique({
      where: { id: req.params.id },
      include: {
        enrollment: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
            course: true,
          },
        },
      },
    })

    if (!grade) {
      return res.status(404).json({ error: { message: 'Grade not found' } })
    }

    res.json({ grade })
  } catch (error) {
    console.error('Get grade error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create grade
router.post('/', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { enrollmentId, score, grade, semester } = req.body

    const newGrade = await prisma.grade.create({
      data: {
        enrollmentId,
        score,
        grade,
        semester,
      },
      include: {
        enrollment: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
            course: true,
          },
        },
      },
    })

    res.status(201).json({ grade: newGrade })
  } catch (error) {
    console.error('Create grade error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update grade
router.put('/:id', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { score, grade, semester } = req.body

    const updatedGrade = await prisma.grade.update({
      where: { id: req.params.id },
      data: {
        score,
        grade,
        semester,
      },
      include: {
        enrollment: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
            course: true,
          },
        },
      },
    })

    res.json({ grade: updatedGrade })
  } catch (error) {
    console.error('Update grade error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Delete grade
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    await prisma.grade.delete({ where: { id: req.params.id } })
    res.json({ message: 'Grade deleted successfully' })
  } catch (error) {
    console.error('Delete grade error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
