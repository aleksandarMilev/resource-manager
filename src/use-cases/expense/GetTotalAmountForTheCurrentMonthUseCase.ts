import { IExpenseRepository } from '../../repositories/expense/IExpenseRepository'

export class GetTotalAmountForTheCurrentMonthUseCase {
    private readonly repository: IExpenseRepository

    constructor(expenseRepository: IExpenseRepository) {
        this.repository = expenseRepository
    }

    async execute(): Promise<number> {
        return await this.repository.totalForCurrentMonth()
    }
}
