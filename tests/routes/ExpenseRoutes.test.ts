import express from 'express'
import request from 'supertest'
import { ExpenseController } from '../../src/controllers/expense/ExpenseController'
import { GetAllExpensesUseCase } from '../../src/use-cases/expense/GetAllExpensesUseCase'
import { GetTotalAmountForTheCurrentMonthUseCase } from '../../src/use-cases/expense/GetTotalAmountForTheCurrentMonthUseCase'
import { CreateExpenseUseCase } from '../../src/use-cases/expense/CreateExpenseUseCase'
import { DeleteExpenseUseCase } from '../../src/use-cases/expense/DeleteExpenseUseCase'
import { ExpenseOutputModel } from '../../src/repositories/expense/models/ExpenseOutputModel'
import { validateExpenseMiddleware } from '../../src/middlewares/expense/validator/ValidateExpenseMiddleware'

jest.mock('../../src/repositories/expense/ExpenseRepository')

jest.mock('../../src/middlewares/expense/validator/ValidateExpenseMiddleware', () => ({
    validateExpenseMiddleware: jest.fn((req, res, next) => next())
}))

const app = express()

app.use(express.json())

const mockRepository = {
    all: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    totalAmountForTheCurrentMonth: jest.fn()
}

const expenseController = new ExpenseController(
    new GetAllExpensesUseCase(mockRepository as any),
    new GetTotalAmountForTheCurrentMonthUseCase(mockRepository as any),
    new CreateExpenseUseCase(mockRepository as any),
    new DeleteExpenseUseCase(mockRepository as any)
)

app.get('/expenses', (req, res, next) => expenseController.getAll(req, res, next))
app.get('/expenses/total', (req, res, next) => expenseController.getTotalAmountForCurrentMonth(req, res, next))
app.post('/expenses', validateExpenseMiddleware, (req, res, next) => expenseController.create(req, res, next))
app.delete('/expenses/:id', (req, res, next) => expenseController.delete(req, res, next))

describe('Expense Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('GET /expenses - should return all expenses', async () => {
        const mockExpenses = [
            new ExpenseOutputModel('1', 100, 'Food', 'Groceries', '2025-01-01'),
            new ExpenseOutputModel('2', 50, 'Transport', 'Bus fare', '2025-01-02'),
        ]

        mockRepository.all.mockResolvedValue(mockExpenses)

        const response = await request(app).get('/expenses')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockExpenses)
    })

    it('GET /expenses - should return empty list if no expenses exist', async () => {
        mockRepository.all.mockResolvedValue([])
    
        const response = await request(app).get('/expenses')
    
        expect(response.status).toBe(200)
        expect(response.body).toEqual([])
    })

    it('GET /expenses/total - should return the total amount for the current month', async () => {
        const mockTotal = 150

        mockRepository.totalAmountForTheCurrentMonth.mockResolvedValue(mockTotal)

        const response = await request(app).get('/expenses/total')

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ total: mockTotal })
    })

    it('POST /expenses - should create a new expense', async () => {
        const mockExpense = new ExpenseOutputModel(
            '123',
            200,
            'Food',
            'Dinner',
            '2025-01-15'
        )

        mockRepository.create.mockResolvedValue(mockExpense)

        const response = await request(app).post('/expenses').send({
            amount: 200,
            category: 'Food',
            description: 'Dinner',
            date: '2025-01-15',
        })

        expect(response.status).toBe(201)
        expect(response.body).toEqual(mockExpense)
    })

    it('DELETE /expenses/:id - should delete an expense', async () => {
        mockRepository.delete.mockResolvedValue(true)

        const response = await request(app).delete('/expenses/123')

        expect(response.status).toBe(204)
    })

    it('DELETE /expenses/:id - should return 400 for invalid delete', async () => {
        mockRepository.delete.mockResolvedValue(false)

        const response = await request(app).delete('/expenses/invalid-id')

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            errorMessage: 'Invalid Id. Unable to delete the record.',
        })
    })
})
