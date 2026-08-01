import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all courses
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        department: true,
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    })
    res.json({ courses })
  } catch (error) {
    console.error('Get courses error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get course by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        department: true,
        teacher: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        enrollments: true,
      },
    })

    if (!course) {
      return res.status(404).json({ error: { message: 'Course not found' } })
    }

    res.json({ course })
  } catch (error) {
    console.error('Get course error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create course
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { code, name, description, credits, departmentId, teacherId } = req.body

    const course = await prisma.course.create({
      data: {
        code,
        name,
        description,
        credits,
        departmentId,
        teacherId,
      },
      include: {
        department: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    res.status(201).json({ course })
  } catch (error) {
    console.error('Create course error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update course
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { name, description, credits, departmentId, teacherId } = req.body

    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        credits,
        departmentId,
        teacherId,
      },
      include: {
        department: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
    })

    res.json({ course })
  } catch (error) {
    console.error('Update course error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Delete course
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } })
    res.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Delete course error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
