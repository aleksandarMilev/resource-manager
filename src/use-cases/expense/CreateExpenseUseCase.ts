import { v4 as uuidv4 } from 'uuid'
import { Expense } from '../../entities/expense/Expense'
import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'
import { ExpenseOutputModel } from '../../repositories/expense/models/ExpenseOutputModel'

export class CreateExpenseUseCase {
    private readonly repository: IExpenseRepository

    constructor(repository: IExpenseRepository) {
        this.repository = repository
    }

    async execute(
        amount: number, 
        category: string, 
        description: string, 
        date: Date
    ): Promise<ExpenseOutputModel> {
        const expense = new Expense(uuidv4(), amount, category, description, date)
        return await this.repository.create(expense)
    }
}
