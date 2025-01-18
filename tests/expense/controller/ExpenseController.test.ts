import { Request, Response, NextFunction } from 'express'
import { ExpenseController } from '../../../src/controllers/expense/ExpenseController'
import { GetAllExpensesUseCase } from '../../../src/use-cases/expense/GetAllExpensesUseCase'
import { GetTotalAmountForTheCurrentMonthUseCase } from '../../../src/use-cases/expense/GetTotalAmountForTheCurrentMonthUseCase'
import { CreateExpenseUseCase } from '../../../src/use-cases/expense/CreateExpenseUseCase'
import { DeleteExpenseUseCase } from '../../../src/use-cases/expense/DeleteExpenseUseCase'
import { ExpenseOutputModel } from '../../../src/repositories/expense/models/ExpenseOutputModel'

jest.mock('../../../src/use-cases/expense/GetAllExpensesUseCase')
jest.mock('../../../src/use-cases/expense/GetTotalAmountForTheCurrentMonthUseCase')
jest.mock('../../../src/use-cases/expense/CreateExpenseUseCase')
jest.mock('../../../src/use-cases/expense/DeleteExpenseUseCase')

describe('ExpenseController', () => {
    let getAllUseCaseMock: jest.Mocked<GetAllExpensesUseCase>
    let getTotalAmountUseCaseMock: jest.Mocked<GetTotalAmountForTheCurrentMonthUseCase>
    let createUseCaseMock: jest.Mocked<CreateExpenseUseCase>
    let deleteUseCaseMock: jest.Mocked<DeleteExpenseUseCase>
    let expenseController: ExpenseController
    let req: Partial<Request>
    let res: Partial<Response>
    let next: jest.Mocked<NextFunction>

    const userId = 'user-123'

    beforeEach(() => {
        getAllUseCaseMock = { execute: jest.fn() } as unknown as jest.Mocked<GetAllExpensesUseCase>
        getTotalAmountUseCaseMock = { execute: jest.fn() } as unknown as jest.Mocked<GetTotalAmountForTheCurrentMonthUseCase>
        createUseCaseMock = { execute: jest.fn() } as unknown as jest.Mocked<CreateExpenseUseCase>
        deleteUseCaseMock = { execute: jest.fn() } as unknown as jest.Mocked<DeleteExpenseUseCase>

        expenseController = new ExpenseController(
            getAllUseCaseMock,
            getTotalAmountUseCaseMock,
            createUseCaseMock,
            deleteUseCaseMock
        )

        req = { body: {}, params: { id: '123' }, user: { id: userId } }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn(), end: jest.fn() }
        next = jest.fn()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return all expenses', async () => {
        const mockExpenses: ExpenseOutputModel[] = [
            new ExpenseOutputModel('1', 100, 'Food', 'Groceries', '2025-01-01'),
            new ExpenseOutputModel('2', 50, 'Transport', 'Bus fare', '2025-01-02'),
        ]

        getAllUseCaseMock.execute.mockResolvedValue(mockExpenses)

        await expenseController.getAll(req as Request, res as Response, next)

        expect(getAllUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(getAllUseCaseMock.execute).toHaveBeenCalledWith(userId)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockExpenses)
    })

    it('should return total amount for the current month', async () => {
        const totalAmount = 500

        getTotalAmountUseCaseMock.execute.mockResolvedValue(totalAmount)

        await expenseController.getTotalAmountForCurrentMonth(req as Request, res as Response, next)

        expect(getTotalAmountUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(getTotalAmountUseCaseMock.execute).toHaveBeenCalledWith(userId)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ total: totalAmount })
    })

    it('should create new expense', async () => {
        const mockExpense = new ExpenseOutputModel('123', 100, 'Food', 'Groceries', '2025-01-01')
        req.body = { amount: 100, category: 'Food', description: 'Groceries', date: '2025-01-01' }

        createUseCaseMock.execute.mockResolvedValue(mockExpense)

        await expenseController.create(req as Request, res as Response, next)

        expect(createUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(createUseCaseMock.execute).toHaveBeenCalledWith(
            100,
            'Food',
            'Groceries',
            new Date('2025-01-01'),
            userId
        )
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(mockExpense)
    })

    it('should delete expense', async () => {
        deleteUseCaseMock.execute.mockResolvedValue(true)

        await expenseController.delete(req as Request, res as Response, next)

        expect(deleteUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(deleteUseCaseMock.execute).toHaveBeenCalledWith('123', userId)
        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
    })

    it('should handle invalid delete request', async () => {
        deleteUseCaseMock.execute.mockResolvedValue(false)

        await expenseController.delete(req as Request, res as Response, next)

        expect(deleteUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(deleteUseCaseMock.execute).toHaveBeenCalledWith('123', userId)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ errorMessage: 'Invalid Expense Id!' })
    })

    it('should handle errors', async () => {
        const error = new Error('Something went wrong!')
        getAllUseCaseMock.execute.mockRejectedValue(error)

        await expenseController.getAll(req as Request, res as Response, next)

        expect(next).toHaveBeenCalledWith(error)
    })
})
