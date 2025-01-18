import { IExpenseRepository } from '../../../src/repositories/expense/IExpenseRepository'
import { GetTotalAmountForTheCurrentMonthUseCase } from '../../../src/use-cases/expense/GetTotalAmountForTheCurrentMonthUseCase'

jest.mock('../../../src/repositories/expense/IExpenseRepository')

describe('GetTotalAmountForTheCurrentMonthUseCase', () => {
    let repositoryMock: jest.Mocked<IExpenseRepository>
    let getTotalAmountForTheCurrentMonthUseCase: GetTotalAmountForTheCurrentMonthUseCase
    const userId = 'user-123'

    beforeEach(() => {
        repositoryMock = {
            totalAmountForTheCurrentMonth: jest.fn(),
        } as unknown as jest.Mocked<IExpenseRepository>

        getTotalAmountForTheCurrentMonthUseCase = new GetTotalAmountForTheCurrentMonthUseCase(repositoryMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return the total amount for the current month', async () => {
        const totalAmount = 500

        repositoryMock.totalAmountForTheCurrentMonth.mockResolvedValue(totalAmount)

        const result = await getTotalAmountForTheCurrentMonthUseCase.execute(userId)

        expect(result).toBe(totalAmount)
        expect(repositoryMock.totalAmountForTheCurrentMonth).toHaveBeenCalledTimes(1)
        expect(repositoryMock.totalAmountForTheCurrentMonth).toHaveBeenCalledWith(userId)
    })

    it('should return 0 if there are no expenses for the current month', async () => {
        const totalAmount = 0

        repositoryMock.totalAmountForTheCurrentMonth.mockResolvedValue(totalAmount)

        const result = await getTotalAmountForTheCurrentMonthUseCase.execute(userId)

        expect(result).toBe(totalAmount)
        expect(repositoryMock.totalAmountForTheCurrentMonth).toHaveBeenCalledTimes(1)
        expect(repositoryMock.totalAmountForTheCurrentMonth).toHaveBeenCalledWith(userId)
    })
})
