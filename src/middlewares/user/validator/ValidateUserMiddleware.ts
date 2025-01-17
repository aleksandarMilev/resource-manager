import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required()
})

export function validateUserMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { error } = userSchema.validate(req.body)

    if (error) {
        res.status(400).json({ error: error.details[0].message })
    } else {
        next()
    }
}
