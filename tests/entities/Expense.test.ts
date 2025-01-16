import { Expense } from '../../src/entities/expense/Expense'

describe('Expense Entity', () => {
    it('should create an instance of Expense with correct properties', () => {
        const id = '1'
        const amount = 100
        const category = 'Food'
        const description = 'Groceries'
        const date = new Date('2025-01-01')

        const expense = new Expense(id, amount, category, description, date);

        expect(expense.Id).toBe(id)
        expect(expense.Amount).toBe(amount)
        expect(expense.Category).toBe(category)
        expect(expense.Description).toBe(description)
        expect(expense.Date).toBe(date)
    })

    it('should throw an error if the amount is zero or negative', () => {
        const id = '1'
        const invalidAmount = 0
        const category = 'Food'
        const description = 'Groceries'
        const date = new Date('2025-01-01')

        expect(() => new Expense(id, invalidAmount, category, description, date))
            .toThrow('Amount should be a positive value')

        expect(() => new Expense(id, -50, category, description, date))
            .toThrow('Amount should be a positive value')
    })
})
