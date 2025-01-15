import { Request, Response, NextFunction } from 'express'
import { ExpenseValidator } from '../../validators/expense/ExpenseValidator'

export function validateExpenseMiddleware(req: Request, res: Response, next: NextFunction): void {
    const validationError = ExpenseValidator.validateExpense(req.body)

    if (validationError) {
        res.status(400).json({ error: validationError.details[0].message })
        return
    }

    next()
}
