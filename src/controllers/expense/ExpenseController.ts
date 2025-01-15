import { Request, Response } from 'express'
import { GetAllExpensesUseCase } from '../../use-cases/expense/GetAllExpensesUseCase'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { DeleteExpenseUseCase } from '../../use-cases/expense/DeleteExpenseUseCase'
import { log } from 'console'

export class ExpenseController {
    private createUseCase: CreateExpenseUseCase
    private getAllUseCase: GetAllExpensesUseCase
    private deleteUseCase: DeleteExpenseUseCase

    constructor(
        createUseCase: CreateExpenseUseCase,
        getAllUseCase: GetAllExpensesUseCase,
        deleteUseCase: DeleteExpenseUseCase
    ) {
        this.createUseCase = createUseCase
        this.getAllUseCase = getAllUseCase
        this.deleteUseCase = deleteUseCase
    }

    async getAll(req: Request, res: Response): Promise<void> {
        const expense = await this.getAllUseCase.execute()
        res.status(200).json(expense)
    }

    async create(req: Request, res: Response): Promise<void> {
        const { amount, category, description, date } = req.body

        const expense = await this.createUseCase.execute(amount, category, description, new Date(date))
        res.status(201).json(expense)
    }

    async delete(req: Request, res: Response): Promise<void> {
        await this.deleteUseCase.execute(req.params.id)
        res.status(204).end()
    }
}
