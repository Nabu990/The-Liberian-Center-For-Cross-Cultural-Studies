import { Router } from 'express'
import { prisma } from '../index'
import { hashPassword, verifyPassword, generateOTP, generateResetToken } from '../../src/lib/password'
import { generateTokens, verifyRefreshToken } from '../../src/lib/auth'
import { authenticate, AuthRequest } from '../middleware/auth'
import { validateEmail, validatePassword, validateRequired } from '../middleware/validation'

const router = Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body

    // Validation
    if (!validateEmail(email)) {
      return res.status(400).json({ error: { message: 'Invalid email address' } })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: { message: passwordValidation.message } })
    }

    const requiredValidation = validateRequired(['email', 'password', 'firstName', 'lastName'], req.body)
    if (!requiredValidation.valid) {
      return res.status(400).json({ error: { message: `Missing required fields: ${requiredValidation.missing?.join(', ')}` } })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: { message: 'User already exists' } })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'VISITOR',
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
    })

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    res.status(201).json({
      user,
      tokens,
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const requiredValidation = validateRequired(['email', 'password'], req.body)
    if (!requiredValidation.valid) {
      return res.status(400).json({ error: { message: `Missing required fields: ${requiredValidation.missing?.join(', ')}` } })
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } })
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      tokens,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: { message: 'Refresh token required' } })
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)

    // Check if user still exists
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    if (!user) {
      return res.status(401).json({ error: { message: 'User not found' } })
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    res.json({ tokens })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(401).json({ error: { message: 'Invalid refresh token' } })
  }
})

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res) => {
  try {
    // In a real implementation, you would add the token to a blacklist
    // For now, we'll just return success
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } })
    }

    res.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: { message: 'Email is required' } })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Return success even if user doesn't exist for security
      return res.json({ message: 'If the email exists, a reset link has been sent' })
    }

    const resetToken = generateResetToken()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // In a real implementation, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`)

    res.json({ message: 'If the email exists, a reset link has been sent' })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ error: { message: 'Token and new password are required' } })
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: { message: passwordValidation.message } })
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return res.status(400).json({ error: { message: 'Invalid or expired reset token' } })
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

// Change password
router.post('/change-password', authenticate, async (req: AuthRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: { message: 'Current and new password are required' } })
    }

    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: { message: passwordValidation.message } })
    }

    const user = await prisma.user.findUnique({ where: { id: req.user?.userId } })
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } })
    }

    const isValidPassword = await verifyPassword(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: { message: 'Current password is incorrect' } })
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: { message: 'Internal server error' } })
  }
})

module.exports = router
