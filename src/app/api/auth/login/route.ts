import { NextResponse } from 'next/server'
import { generateTokens } from '@/lib/auth'
import { verifyPassword } from '@/lib/password'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!normalizedEmail || typeof password !== 'string') {
      return NextResponse.json({ error: { message: 'Email and password are required.' } }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
      },
    })

    if (!user?.password || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: { message: 'Invalid email or password.' } }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: { message: 'This account is inactive. Please contact the administrator.' } }, { status: 403 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    const { password: _password, isActive: _isActive, ...safeUser } = user
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({ user: safeUser, tokens })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: { message: 'We could not sign you in right now. Please try again later.' } },
      { status: 500 }
    )
  }
}
