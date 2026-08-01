import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all library items
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const items = await prisma.library.findMany({
      include: {
        borrowedBy: {
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
    res.json({ items })
  } catch (error) {
    console.error('Get library items error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get library item by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const item = await prisma.library.findUnique({
      where: { id: req.params.id },
      include: {
        borrowedBy: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!item) {
      return res.status(404).json({ error: { message: 'Library item not found' } })
    }

    res.json({ item })
  } catch (error) {
    console.error('Get library item error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create library item
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'LIBRARIAN'), async (req: AuthRequest, res) => {
  try {
    const { title, author, isbn, type, quantity, category } = req.body

    const item = await prisma.library.create({
      data: {
        title,
        author,
        isbn,
        type,
        quantity,
        available: quantity,
        category,
      },
    })

    res.status(201).json({ item })
  } catch (error) {
    console.error('Create library item error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Borrow library item
router.post('/:id/borrow', authenticate, async (req: AuthRequest, res) => {
  try {
    const { studentId } = req.body

    const item = await prisma.library.findUnique({ where: { id: req.params.id } })
    
    if (!item || item.available <= 0) {
      return res.status(400).json({ error: { message: 'Item not available' } })
    }

    const updatedItem = await prisma.library.update({
      where: { id: req.params.id },
      data: {
        available: item.available - 1,
        borrowedById: studentId,
        borrowedAt: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    })

    res.json({ item: updatedItem })
  } catch (error) {
    console.error('Borrow item error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Return library item
router.post('/:id/return', authenticate, authorize('ADMIN', 'SUPER_ADMIN', 'LIBRARIAN'), async (req: AuthRequest, res) => {
  try {
    const item = await prisma.library.findUnique({ where: { id: req.params.id } })
    
    if (!item) {
      return res.status(404).json({ error: { message: 'Item not found' } })
    }

    const updatedItem = await prisma.library.update({
      where: { id: req.params.id },
      data: {
        available: item.available + 1,
        borrowedById: null,
        borrowedAt: null,
        dueDate: null,
      },
    })

    res.json({ item: updatedItem })
  } catch (error) {
    console.error('Return item error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
