import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        res.status(401).json({ message: 'Authorization token missing' })
        return
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)
        req.user = { id: decoded.userId }

        next()
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' })
    }
}

export default authenticationMiddleware
