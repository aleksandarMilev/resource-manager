import { Request, Response } from 'express'
import { CreateExpenseUseCase } from '../use-cases/CreateExpenseUseCase'
import { expenseSchema } from '../validators/ExpenseValidation'

export class ExpenseController {
    private createUseCase: CreateExpenseUseCase

    constructor(createUseCase: CreateExpenseUseCase) {
        this.createUseCase = createUseCase
    }

    async createExpense(req: Request, res: Response): Promise<void> {
        const { error } = expenseSchema.validate(req.body)

        if (error) {
            res.status(400).json({ error: error.details[0].message })
            return
        }

        const { amount, category, description, date } = req.body

        try {
            const expense = await this.createUseCase.execute(amount, category, description, new Date(date))
            res.status(201).json(expense)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Failed to create expense' })
        }
    }
}
