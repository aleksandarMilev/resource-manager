import { Expense } from '../../entities/expense/Expense'
import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'

export class GetAllExpensesUseCase {
    private readonly repository: IExpenseRepository

    constructor(expenseRepository: IExpenseRepository) {
        this.repository = expenseRepository
    }

    async execute(): Promise<Expense[]> {
        return await this.repository.all()
    }
}
