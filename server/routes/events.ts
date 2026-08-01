import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    })
    res.json({ events })
  } catch (error) {
    console.error('Get events error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    })

    if (!event) {
      return res.status(404).json({ error: { message: 'Event not found' } })
    }

    res.json({ event })
  } catch (error) {
    console.error('Get event error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create event
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { title, description, startDate, endDate, location, imageUrl } = req.body

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        imageUrl,
      },
    })

    res.status(201).json({ event })
  } catch (error) {
    console.error('Create event error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update event
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { title, description, startDate, endDate, location, imageUrl } = req.body

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        imageUrl,
      },
    })

    res.json({ event })
  } catch (error) {
    console.error('Update event error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Delete event
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } })
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Delete event error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
