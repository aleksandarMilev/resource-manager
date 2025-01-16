import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'
import { ExpenseOutputModel } from '../../repositories/expense/models/ExpenseOutputModel'

export class GetAllExpensesUseCase {
    private readonly repository: IExpenseRepository

    constructor(repository: IExpenseRepository) {
        this.repository = repository
    }

    async execute(): Promise<ExpenseOutputModel[]> {
        return await this.repository.all()
    }
}
