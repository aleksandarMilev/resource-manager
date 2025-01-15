import { Request, Response } from 'express'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { GetAllExpensesUseCase } from '../../use-cases/expense/GetAllExpensesUseCase'

export class ExpenseController {
    private createUseCase: CreateExpenseUseCase
    private getAllUseCase: GetAllExpensesUseCase

    constructor(
        createUseCase: CreateExpenseUseCase,
        getAllUseCase: GetAllExpensesUseCase) {
        this.createUseCase = createUseCase
        this.getAllUseCase = getAllUseCase
    }

    async create(req: Request, res: Response): Promise<void> {
        const { amount, category, description, date } = req.body

        const expense = await this.createUseCase.execute(amount, category, description, new Date(date))
        res.status(201).json(expense)
    }

    async getAll(req: Request, res: Response): Promise<void> {
        const expense = await this.getAllUseCase.execute()
        res.status(200).json(expense)
    }
}
