import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all students
router.get('/', authenticate, authorize('TEACHER', 'ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        program: true,
        enrollments: true,
      },
    })
    res.json({ students })
  } catch (error) {
    console.error('Get students error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get student by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const student = await prisma.student.findUnique({
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
        program: true,
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!student) {
      return res.status(404).json({ error: { message: 'Student not found' } })
    }

    res.json({ student })
  } catch (error) {
    console.error('Get student error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create student profile
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { userId, programId, studentId, dateOfBirth, address, emergencyContact } = req.body

    const student = await prisma.student.create({
      data: {
        userId,
        programId,
        studentId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        emergencyContact,
      },
      include: {
        user: true,
        program: true,
      },
    })

    res.status(201).json({ student })
  } catch (error) {
    console.error('Create student error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update student
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { programId, dateOfBirth, address, emergencyContact } = req.body

    const student = await prisma.student.update({
      where: { id: req.params.id },
      data: {
        programId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address,
        emergencyContact,
      },
      include: {
        user: true,
        program: true,
      },
    })

    res.json({ student })
  } catch (error) {
    console.error('Update student error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
