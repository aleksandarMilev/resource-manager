import { Request, Response, NextFunction } from 'express'

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    res.status(404).json({
        errorMessage: `Route ${req.originalUrl} not found!`
    })
}

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        errorMessage: 'Internal Server Error!'
    })
}