import { PrismaClient } from '@prisma/client'
import { ExpenseRepository } from '../../../src/repositories/expense/ExpenseRepository'
import { ExpenseOutputModel } from '../../../src/repositories/expense/models/ExpenseOutputModel'
import { Expense } from '../../../src/entities/expense/Expense'

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            expense: {
                findMany: jest.fn(),
                aggregate: jest.fn(),
                create: jest.fn(),
                findFirst: jest.fn(),
                delete: jest.fn()
            }
        }))
    }
})

describe('ExpenseRepository', () => {
    let prismaMock: jest.Mocked<PrismaClient>
    let repository: ExpenseRepository
    const userId = 'user-123'

    beforeEach(() => {
        prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>
        repository = new ExpenseRepository(prismaMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return all expenses', async () => {
        const mockExpenses = [
            { id: '1', amount: 100, category: 'Food', description: 'Lunch', date: new Date(), userId: userId },
            { id: '2', amount: 50, category: 'Transport', description: 'Bus ticket', date: new Date(), userId: userId }
        ];

        (prismaMock.expense.findMany as jest.Mock).mockResolvedValue(mockExpenses)

        const result = await repository.all(userId)

        expect(result).toEqual([
            new ExpenseOutputModel('1', 100, 'Food', 'Lunch', mockExpenses[0].date.toISOString().split('T')[0]),
            new ExpenseOutputModel('2', 50, 'Transport', 'Bus ticket', mockExpenses[1].date.toISOString().split('T')[0])
        ])
    })

    it('should return an empty array if no expenses exist for the current user', async () => {
        (prismaMock.expense.findMany as jest.Mock).mockResolvedValue([])

        const result = await repository.all(userId)

        expect(result).toEqual([])
    })

    it('should return total amount for the current month', async () => {
        const mockTotal = { _sum: { amount: 150 } };

        (prismaMock.expense.aggregate as jest.Mock).mockResolvedValue(mockTotal)

        const result = await repository.totalAmountForTheCurrentMonth(userId)

        expect(result).toBe(150)
    })

    it('should return 0 if no expenses for the current month', async () => {
        const mockTotal = { _sum: { amount: 0 } };

        (prismaMock.expense.aggregate as jest.Mock).mockResolvedValue(mockTotal)

        const result = await repository.totalAmountForTheCurrentMonth(userId)

        expect(result).toBe(0)
    })

    it('should create a new expense for the user', async () => {
        const mockExpense = new Expense('1', 100, 'Food', 'Lunch', new Date(), userId);

        (prismaMock.expense.create as jest.Mock).mockResolvedValue(mockExpense)

        const result = await repository.create(mockExpense)

        expect(result).toEqual(
            new ExpenseOutputModel('1', 100, 'Food', 'Lunch', mockExpense.Date.toISOString().split('T')[0])
        )
    })

    it('should delete an expense and return true', async () => {
        const mockExpense = { id: '1', userId: userId };

        (prismaMock.expense.findFirst as jest.Mock).mockResolvedValue(mockExpense);
        (prismaMock.expense.delete as jest.Mock).mockResolvedValue(mockExpense)

        const result = await repository.delete('1', userId)

        expect(result).toBe(true)
    })

    it('should return false if the expense userId is not same as the current userId', async () => {
        const mockExpense = { id: '1', userId: 'other-user' };

        (prismaMock.expense.findFirst as jest.Mock).mockResolvedValue(mockExpense)

        const result = await repository.delete('1', userId)

        expect(result).toBe(false)
    })

    it('should return false if expense Id is invalid', async () => {
        (prismaMock.expense.findFirst as jest.Mock).mockResolvedValue(null)

        const result = await repository.delete('invalid-expense-id', userId)

        expect(result).toBe(false)
    })
})