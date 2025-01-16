import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'

export class DeleteExpenseUseCase {
    private readonly repository: IExpenseRepository

    constructor(repository: IExpenseRepository) {
        this.repository = repository
    }

    async execute(id: string): Promise<boolean> {
        return await this.repository.delete(id)
    }
}
