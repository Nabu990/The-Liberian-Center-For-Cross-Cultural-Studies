import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all teachers
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        department: true,
      },
    })
    res.json({ teachers })
  } catch (error) {
    console.error('Get teachers error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get teacher by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        department: true,
        courses: true,
      },
    })

    if (!teacher) {
      return res.status(404).json({ error: { message: 'Teacher not found' } })
    }

    res.json({ teacher })
  } catch (error) {
    console.error('Get teacher error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create teacher profile
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { userId, departmentId, employeeId, specialization, hireDate } = req.body

    const teacher = await prisma.teacher.create({
      data: {
        userId,
        departmentId,
        employeeId,
        specialization,
        hireDate: hireDate ? new Date(hireDate) : null,
      },
      include: {
        user: true,
        department: true,
      },
    })

    res.status(201).json({ teacher })
  } catch (error) {
    console.error('Create teacher error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update teacher
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { departmentId, specialization, hireDate } = req.body

    const teacher = await prisma.teacher.update({
      where: { id: req.params.id },
      data: {
        departmentId,
        specialization,
        hireDate: hireDate ? new Date(hireDate) : undefined,
      },
      include: {
        user: true,
        department: true,
      },
    })

    res.json({ teacher })
  } catch (error) {
    console.error('Update teacher error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
