import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all payments
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE_OFFICER'), async (req: AuthRequest, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    })
    res.json({ payments })
  } catch (error) {
    console.error('Get payments error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get payment by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!payment) {
      return res.status(404).json({ error: { message: 'Payment not found' } })
    }

    res.json({ payment })
  } catch (error) {
    console.error('Get payment error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create payment
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE_OFFICER'), async (req: AuthRequest, res) => {
  try {
    const { studentId, amount, paymentType, description, semester } = req.body

    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount,
        paymentType,
        description,
        semester,
        status: 'PENDING',
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    res.status(201).json({ payment })
  } catch (error) {
    console.error('Create payment error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update payment status
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'FINANCE_OFFICER'), async (req: AuthRequest, res) => {
  try {
    const { status, transactionId } = req.body

    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: {
        status,
        transactionId,
        paidAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    })

    res.json({ payment })
  } catch (error) {
    console.error('Update payment error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
