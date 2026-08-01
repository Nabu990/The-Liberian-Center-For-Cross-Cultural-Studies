import { Request, Response, NextFunction } from 'express'

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone)
}

export function validateRequired(fields: string[], body: any): { valid: boolean; missing?: string[] } {
  const missing = fields.filter(field => !body[field])
  if (missing.length > 0) {
    return { valid: false, missing }
  }
  return { valid: true }
}

export function validationMiddleware(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body)
    
    if (error) {
      return res.status(400).json({
        error: {
          message: 'Validation error',
          details: error.details.map((d: any) => d.message),
        },
      })
    }
    
    req.body = value
    next()
  }
}
