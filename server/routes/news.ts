import { Router } from 'express'
import { prisma } from '../index'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    res.json({ news })
  } catch (error) {
    console.error('Get news error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get news by ID
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id: req.params.id },
      include: {
        author: true,
      },
    })

    if (!newsItem) {
      return res.status(404).json({ error: { message: 'News not found' } })
    }

    res.json({ news: newsItem })
  } catch (error) {
    console.error('Get news error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Create news
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { title, content, category, imageUrl } = req.body

    const newsItem = await prisma.news.create({
      data: {
        title,
        content,
        category,
        imageUrl,
        authorId: req.user?.userId,
        published: true,
      },
      include: {
        author: true,
      },
    })

    res.status(201).json({ news: newsItem })
  } catch (error) {
    console.error('Create news error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Update news
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    const { title, content, category, imageUrl, published } = req.body

    const newsItem = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        category,
        imageUrl,
        published,
      },
      include: {
        author: true,
      },
    })

    res.json({ news: newsItem })
  } catch (error) {
    console.error('Update news error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Delete news
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: AuthRequest, res) => {
  try {
    await prisma.news.delete({ where: { id: req.params.id } })
    res.json({ message: 'News deleted successfully' })
  } catch (error) {
    console.error('Delete news error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
