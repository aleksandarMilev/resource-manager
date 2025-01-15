import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'

export class DeleteExpenseUseCase {
    private readonly repository: IExpenseRepository

    constructor(expenseRepository: IExpenseRepository) {
        this.repository = expenseRepository
    }

    async execute(id: string): Promise<void> {
        await this.repository.delete(id)
    }
}
