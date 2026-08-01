import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { generateTokens } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/register?error=missing_code`)
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Google token error:', tokenData)
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/register?error=token_exchange_failed`)
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error('Google user info error:', userData)
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/register?error=user_info_failed`)
    }

    const googleEmail = userData.email?.toLowerCase()
    const googleId = userData.id
    const firstName = userData.given_name || 'User'
    const lastName = userData.family_name || ''

    if (!googleEmail) {
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/register?error=no_email`)
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleEmail },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isActive: true,
        student: {
          select: {
            id: true,
            studentId: true,
          },
        },
      },
    })

    if (user) {
      // User exists, log them in
      if (!user.isActive) {
        return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/register?error=account_inactive`)
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      })

      const safeUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        student: user.student,
      }

      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      // Redirect to dashboard with tokens in URL (will be handled by client)
      const redirectUrl = new URL(`${NEXT_PUBLIC_APP_URL}/dashboard`)
      redirectUrl.searchParams.set('accessToken', tokens.accessToken)
      redirectUrl.searchParams.set('refreshToken', tokens.refreshToken)
      redirectUrl.searchParams.set('user', JSON.stringify(safeUser))

      return NextResponse.redirect(redirectUrl.toString())
    }

    // Create new user
    const currentYear = new Date().getFullYear()
    const studentSemester = 1
    const studentLevel = 1

    const newUser = await prisma.$transaction(async (transaction) => {
      const studentCount = await transaction.student.count({
        where: { admissionYear: currentYear },
      })
      const studentId = `LCCCS-${currentYear}-${String(studentCount + 1).padStart(4, '0')}`

      return transaction.user.create({
        data: {
          email: googleEmail,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role: 'STUDENT',
          isEmailVerified: true,
          googleId,
          student: {
            create: {
              studentId,
              semester: studentSemester,
              level: studentLevel,
              admissionYear: currentYear,
              expectedGraduationYear: currentYear + 4,
              department: {
                connectOrCreate: {
                  where: { code: 'CCS' },
                  create: {
                    name: 'Cross Cultural Studies',
                    code: 'CCS',
                    description: 'The Liberian Center for Cross Cultural Studies concentration.',
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          student: {
            select: {
              id: true,
              studentId: true,
            },
          },
        },
      })
    })

    const tokens = generateTokens({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })

    // Redirect to dashboard with tokens
    const redirectUrl = new URL(`${NEXT_PUBLIC_APP_URL}/dashboard`)
    redirectUrl.searchParams.set('accessToken', tokens.accessToken)
    redirectUrl.searchParams.set('refreshToken', tokens.refreshToken)
    redirectUrl.searchParams.set('user', JSON.stringify(newUser))

    return NextResponse.redirect(redirectUrl.toString())
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/register?error=oauth_failed`)
  }
}
