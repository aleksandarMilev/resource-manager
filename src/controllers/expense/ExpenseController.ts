import { Request, Response } from 'express'
import { GetAllExpensesUseCase } from '../../use-cases/expense/GetAllExpensesUseCase'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { DeleteExpenseUseCase } from '../../use-cases/expense/DeleteExpenseUseCase'
import { GetTotalAmountForTheCurrentMonthUseCase } from '../../use-cases/expense/GetTotalAmountForTheCurrentMonthUseCase'

export class ExpenseController {
    private readonly getAllUseCase: GetAllExpensesUseCase
    private readonly getTotalAmountForCurrentMonthUseCase: GetTotalAmountForTheCurrentMonthUseCase
    private readonly createUseCase: CreateExpenseUseCase
    private readonly deleteUseCase: DeleteExpenseUseCase

    constructor(
        getAllUseCase: GetAllExpensesUseCase,
        getTotalAmountForCurrentMonthUseCase: GetTotalAmountForTheCurrentMonthUseCase,
        createUseCase: CreateExpenseUseCase,
        deleteUseCase: DeleteExpenseUseCase
    ) {
        this.getAllUseCase = getAllUseCase
        this.getTotalAmountForCurrentMonthUseCase = getTotalAmountForCurrentMonthUseCase,
        this.createUseCase = createUseCase,
        this.deleteUseCase = deleteUseCase
    }

    async getAll(req: Request, res: Response): Promise<void> {
        const expense = await this.getAllUseCase.execute()
        res.status(200).json(expense)
    }

    async getTotalAmountForCurrentMonth(req: Request, res: Response): Promise<void> {
        const expense = await this.getTotalAmountForCurrentMonthUseCase.execute()
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
