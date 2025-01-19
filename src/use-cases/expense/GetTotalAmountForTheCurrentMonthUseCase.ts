import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'

export class GetTotalAmountForTheCurrentMonthUseCase {
    private readonly repository: IExpenseRepository

    constructor(repository: IExpenseRepository) {
        this.repository = repository
    }

    async execute(userId: string): Promise<number> {
        return await this.repository.totalAmountForTheCurrentMonth(userId)
    }
}