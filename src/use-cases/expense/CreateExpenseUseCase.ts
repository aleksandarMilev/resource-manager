import { Expense } from '../../entities/expense/Expense'
import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'

export class CreateExpenseUseCase {
    private readonly repository: IExpenseRepository

    constructor(expenseRepository: IExpenseRepository) {
        this.repository = expenseRepository
    }

    async execute(amount: number, category: string, description: string, date: Date): Promise<Expense> {
        const expense = new Expense(amount, category, description, date)
        return await this.repository.create(expense)
    }
}
