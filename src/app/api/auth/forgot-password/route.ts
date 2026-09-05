import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!normalizedEmail) {
      return NextResponse.json({ error: { message: 'Email is required.' } }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        firstName: true,
      },
    })

    // Check if user exists
    if (!user) {
      return NextResponse.json({ 
        error: { message: 'No account found with this email address.' }
      }, { status: 404 })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpires = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    })

    const resetUrl = `${process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    // Try to send email
    try {
      const { sendPasswordResetEmail } = await import('@/lib/email')
      const emailSent = await sendPasswordResetEmail(user.email, user.firstName, resetUrl)
      
      if (!emailSent) {
        console.error('Failed to send password reset email, returning link in response instead')
        return NextResponse.json({ 
          message: 'Email sending failed. Please use the link below to reset your password.',
          resetUrl 
        })
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json({ 
        message: 'Email sending failed. Please use the link below to reset your password.',
        resetUrl 
      })
    }

    return NextResponse.json({ 
      message: 'If an account exists with this email, a password reset link has been sent.',
      resetUrl: null 
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: { message: 'We could not process your request. Please try again later.' } },
      { status: 500 }
    )
  }
}
