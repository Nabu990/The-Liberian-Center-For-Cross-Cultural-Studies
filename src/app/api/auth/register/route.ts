import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { hashPassword } from '@/lib/password'
import { prisma } from '@/lib/prisma'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validatePassword(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password)
  )
}

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone, semester, level } = await request.json()
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const currentYear = new Date().getFullYear()
    const studentSemester = Number(semester) || 1
    const studentLevel = Number(level) || 1

    if (!normalizedEmail || !password || !firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: { message: 'Please complete all required fields.' } }, { status: 400 })
    }

    if (!emailPattern.test(normalizedEmail)) {
      return NextResponse.json({ error: { message: 'Enter a valid email address.' } }, { status: 400 })
    }

    if (typeof password !== 'string' || !validatePassword(password)) {
      return NextResponse.json(
        { error: { message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' } },
        { status: 400 }
      )
    }

    const user = await prisma.$transaction(async (transaction) => {
      const studentCount = await transaction.student.count({
        where: { admissionYear: currentYear },
      })
      const studentId = `LCCCS-${currentYear}-${String(studentCount + 1).padStart(4, '0')}`

      return transaction.user.create({
        data: {
          email: normalizedEmail,
          password: await hashPassword(password),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: typeof phone === 'string' ? phone.trim() || null : null,
          role: 'STUDENT',
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
          createdAt: true,
          student: { select: { studentId: true } },
        },
      })
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: { message: 'An account with this email already exists.' } }, { status: 409 })
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: { message: 'We could not create your account right now. Please try again later.' } },
      { status: 500 }
    )
  }
}
