import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../../src/lib/auth'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    role: string
  }
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'No token provided' } })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } })
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Authentication required' } })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Insufficient permissions' } })
    }

    next()
  }
}
