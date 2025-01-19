import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const expenseSchema = Joi.object({
    amount: Joi.number().positive().required(),
    category: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(2).max(2000).required(),
    date: Joi.date().required()
})

export function validateExpenseMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { error } = expenseSchema.validate(req.body)

    if (error) {
        res.status(400).json({ error: error.details[0].message })
    } else {
        next()
    }
}