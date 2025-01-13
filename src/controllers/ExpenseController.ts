import { Request, Response } from 'express'
import { CreateExpenseUseCase } from '../useCases/CreateExpenseUseCase'

export class ExpenseController {
    private createUseCase: CreateExpenseUseCase

    constructor(createUseCase: CreateExpenseUseCase) {
        this.createUseCase = createUseCase
    }

    async createExpense(req: Request, res: Response): Promise<void> {
        const { amount, category, description, date } = req.body

        try {
            const expense = await this.createUseCase.execute(amount, category, description, new Date(date))
            res.status(201).json(expense)
        } catch (error) {
            res.status(500).json({ error: 'Failed to create expense' })
        }
    }
}