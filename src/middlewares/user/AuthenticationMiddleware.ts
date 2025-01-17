import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../../repositories/user/jwt/Jwt'

interface AuthenticatedRequest extends Request {
    user?: { userId: string; role: string }
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        res.status(401).json({ error: 'No token provided' })
        return
    }

    const decoded = verifyToken(token)

    if (!decoded) {
        res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = { userId: decoded.userId, role: decoded.role }
    next()
}
