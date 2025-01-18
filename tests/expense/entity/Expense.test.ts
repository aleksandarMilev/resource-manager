import { Expense } from '../../../src/entities/expense/Expense'
import { InvalidExpenseError } from '../../../src/entities/expense/InvalidExpenseError'

describe('Expense Entity', () => {
    it('should create an instance', () => {
        const id = '1'
        const amount = 100
        const category = 'Food'
        const description = 'Groceries'
        const date = new Date('2025-01-01')
        const userId = 'user-123'

        const expense = new Expense(id, amount, category, description, date, userId)

        expect(expense.Id).toBe(id)
        expect(expense.Amount).toBe(amount)
        expect(expense.Category).toBe(category)
        expect(expense.Description).toBe(description)
        expect(expense.Date).toBe(date)
        expect(expense.UserId).toBe(userId)
    })

    it('should create an instance if amount is close to zero but positive', () => {
        const id = '1'
        const amount = 0.00001
        const category = 'Food'
        const description = 'Groceries'
        const date = new Date('2025-01-01')
        const userId = 'user-123'

        const expense = new Expense(id, amount, category, description, date, userId)

        expect(expense.Id).toBe(id)
        expect(expense.Amount).toBe(amount)
        expect(expense.Category).toBe(category)
        expect(expense.Description).toBe(description)
        expect(expense.Date).toBe(date)
        expect(expense.UserId).toBe(userId)
    })

    it('should throw InvalidExpenseError if amount is zero or negative', () => {
        const id = '1'
        const category = 'Food'
        const description = 'Groceries'
        const date = new Date('2025-01-01')
        const userId = 'user-123'

        expect(() => new Expense(id, 0, category, description, date, userId))
            .toThrow(InvalidExpenseError)

        expect(() => new Expense(id, 0, category, description, date, userId))
            .toThrow('Amount should be greater than 0!')

        expect(() => new Expense(id, -50, category, description, date, userId))
            .toThrow(InvalidExpenseError)

        expect(() => new Expense(id, -50, category, description, date, userId))
            .toThrow('Amount should be greater than 0!')
    })

    it('should throw InvalidExpenseError if category length is invalid', () => {
        const id = '1'
        const amount = 100
        const description = 'Groceries'
        const date = new Date('2025-01-01')
        const userId = 'user-123'

        expect(() => new Expense(id, amount, 'F', description, date, userId))
            .toThrow(InvalidExpenseError)

        expect(() => new Expense(id, amount, 'F', description, date, userId))
            .toThrow('Category length should be between 2 and 100 characters!')

        const longCategory = 'A'.repeat(101)

        expect(() => new Expense(id, amount, longCategory, description, date, userId))
            .toThrow(InvalidExpenseError)

        expect(() => new Expense(id, amount, longCategory, description, date, userId))
            .toThrow('Category length should be between 2 and 100 characters!')
    })

    it('should throw InvalidExpenseError if description lenght is invalid', () => {
        const id = '1'
        const amount = 100
        const category = 'Food'
        const date = new Date('2025-01-01')
        const userId = 'user-123'

        expect(() => new Expense(id, amount, category, 'A', date, userId))
            .toThrow(InvalidExpenseError)

        expect(() => new Expense(id, amount, category, 'A', date, userId))
            .toThrow('Description length should be between 2 and 2000 characters!')

        const longDescription = 'A'.repeat(2001)

        expect(() => new Expense(id, amount, category, longDescription, date, userId))
            .toThrow(InvalidExpenseError)

        expect(() => new Expense(id, amount, category, longDescription, date, userId))
            .toThrow('Description length should be between 2 and 2000 characters!')
    })
})
