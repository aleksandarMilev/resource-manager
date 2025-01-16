import { Request, Response, NextFunction } from 'express'

const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({
        errorMessage: `Route ${req.originalUrl} not found`
    })
}

export default notFoundMiddleware
