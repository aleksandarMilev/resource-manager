import { Request, Response, NextFunction } from 'express'
import { GetAllExpensesUseCase } from '../../use-cases/expense/GetAllExpensesUseCase'
import { GetTotalAmountForTheCurrentMonthUseCase } from '../../use-cases/expense/GetTotalAmountForTheCurrentMonthUseCase'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { DeleteExpenseUseCase } from '../../use-cases/expense/DeleteExpenseUseCase'

const InvalidIdErrorMessage = 'Invalid Expense Id!'

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
        this.getTotalAmountForCurrentMonthUseCase = getTotalAmountForCurrentMonthUseCase
        this.createUseCase = createUseCase
        this.deleteUseCase = deleteUseCase
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = ExpenseController.GetUserId(req)
            const expenses = await this.getAllUseCase.execute(userId)
            res.status(200).json(expenses)
        } catch (error) {
            next(error)
        }
    }

    async getTotalAmountForCurrentMonth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = ExpenseController.GetUserId(req)
            const amount = await this.getTotalAmountForCurrentMonthUseCase.execute(userId)
            res.status(200).json({ total: amount })
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = ExpenseController.GetUserId(req)
            const { amount, category, description, date } = req.body
    
            const expense = await this.createUseCase.execute(
                amount,
                category,
                description,
                new Date(date),
                userId
            )
    
            res.status(201).json(expense)
        } catch (error) {
            next(error)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const expenseId = req.params.id
            const userId = ExpenseController.GetUserId(req)
            const success = await this.deleteUseCase.execute(expenseId, userId)

            if (success) {
                res.status(204).end()
            } else {
                res.status(400).json({ errorMessage: InvalidIdErrorMessage })
            }
        } catch (error) {
            next(error)
        }
    }

    private static GetUserId(req: Request): string {
        return req?.user?.id!
    }   
}