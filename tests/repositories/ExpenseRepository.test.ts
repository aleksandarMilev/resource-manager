import { PrismaClient } from '@prisma/client'
import { ExpenseRepository } from '../../src/repositories/expense/ExpenseRepository'
import { ExpenseOutputModel } from '../../src/repositories/expense/models/ExpenseOutputModel'
import { Expense } from '../../src/entities/expense/Expense'

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

    beforeEach(() => {
        prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>
        repository = new ExpenseRepository(prismaMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return all expenses', async () => {
        const mockExpenses = [
            { id: '1', amount: 100, category: 'Food', description: 'Lunch', date: new Date() },
            { id: '2', amount: 50, category: 'Transport', description: 'Bus ticket', date: new Date() }
        ];

        (prismaMock.expense.findMany as jest.Mock).mockResolvedValue(mockExpenses)

        const result = await repository.all()

        expect(result).toEqual([
            new ExpenseOutputModel('1', 100, 'Food', 'Lunch', mockExpenses[0].date.toISOString().split('T')[0]),
            new ExpenseOutputModel('2', 50, 'Transport', 'Bus ticket', mockExpenses[1].date.toISOString().split('T')[0])
        ])
    })

    it('should return an empty array if no expenses exist', async () => {
        (prismaMock.expense.findMany as jest.Mock).mockResolvedValue([])
    
        const result = await repository.all()
    
        expect(result).toEqual([])
    })

    it('should return total amount for the current month', async () => {
        const mockTotal = { _sum: { amount: 150 } };

        (prismaMock.expense.aggregate as jest.Mock).mockResolvedValue(mockTotal)

        const result = await repository.totalAmountForTheCurrentMonth()

        expect(result).toBe(150)
    })

    it('should return 0 if no expenses for the current month', async () => {
        const mockTotal = { _sum: { amount: 0 } };
    
        (prismaMock.expense.aggregate as jest.Mock).mockResolvedValue(mockTotal)
    
        const result = await repository.totalAmountForTheCurrentMonth()
    
        expect(result).toBe(0)
    })

    it('should return the correct total amount when there are negative expenses', async () => {
        const mockTotal = { _sum: { amount: -50 } };
    
        (prismaMock.expense.aggregate as jest.Mock).mockResolvedValue(mockTotal)
    
        const result = await repository.totalAmountForTheCurrentMonth()
    
        expect(result).toBe(-50)
    })

    it('should create a new expense', async () => {
        const mockExpense = new Expense('1', 100, 'Food', 'Lunch', new Date());

        (prismaMock.expense.create as jest.Mock).mockResolvedValue(mockExpense)

        const result = await repository.create(mockExpense)

        expect(result).toEqual(
            new ExpenseOutputModel('1', 100, 'Food', 'Lunch', mockExpense.Date.toISOString().split('T')[0])
        )
    })

    it('should delete an expense and return true', async () => {
        const mockExpense = { id: '1' };

        (prismaMock.expense.findFirst as jest.Mock).mockResolvedValue(mockExpense);
        (prismaMock.expense.delete as jest.Mock).mockResolvedValue(mockExpense)

        const result = await repository.delete('1')

        expect(result).toBe(true)
    })

    it('should return false when trying to delete a non-existent expense', async () => {
        (prismaMock.expense.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await repository.delete('invalid-id')

        expect(result).toBe(false)
    })
})
