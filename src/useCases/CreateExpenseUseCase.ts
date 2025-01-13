import { Expense } from '../entities/Expense'
import { IExpenseRepository } from '../repositories/IExpenseRepository'

export class CreateExpenseUseCase {
    private expenseRepository: IExpenseRepository

    constructor(expenseRepository: IExpenseRepository) {
        this.expenseRepository = expenseRepository
    }

    async execute(amount: number, category: string, description: string, date: Date): Promise<Expense> {
        const expense = new Expense(amount, category, description, date)
        return await this.expenseRepository.create(expense)
    }
}
