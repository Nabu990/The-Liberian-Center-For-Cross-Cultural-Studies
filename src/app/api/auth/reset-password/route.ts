import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || typeof password !== 'string') {
      return NextResponse.json({ error: { message: 'Token and password are required.' } }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: { message: 'Password must be at least 8 characters.' } }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token },
      select: {
        id: true,
        resetTokenExpires: true,
      },
    })

    if (!user || !user.resetTokenExpires) {
      return NextResponse.json({ error: { message: 'Invalid or expired reset token.' } }, { status: 400 })
    }

    if (user.resetTokenExpires < new Date()) {
      return NextResponse.json({ error: { message: 'Reset token has expired. Please request a new password reset.' } }, { status: 400 })
    }

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hashPassword(password),
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    return NextResponse.json({ message: 'Password has been reset successfully.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: { message: 'We could not reset your password. Please try again later.' } },
      { status: 500 }
    )
  }
}
