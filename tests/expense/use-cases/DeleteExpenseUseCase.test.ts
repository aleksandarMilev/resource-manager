import { DeleteExpenseUseCase } from '../../../src/use-cases/expense/DeleteExpenseUseCase'
import { IExpenseRepository } from '../../../src/repositories/expense/IExpenseRepository'

jest.mock('../../../src/repositories/expense/IExpenseRepository')

describe('DeleteExpenseUseCase', () => {
    let repositoryMock: jest.Mocked<IExpenseRepository>
    let deleteExpenseUseCase: DeleteExpenseUseCase
    const userId = 'user-123'

    beforeEach(() => {
        repositoryMock = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<IExpenseRepository>

        deleteExpenseUseCase = new DeleteExpenseUseCase(repositoryMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should delete the expense and return true', async () => {
        const expenseId = '123'

        repositoryMock.delete.mockResolvedValue(true)

        const result = await deleteExpenseUseCase.execute(expenseId, userId)

        expect(result).toBe(true)
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1)
        expect(repositoryMock.delete).toHaveBeenCalledWith(expenseId, userId)
    })

    it('should return false if expense Id is invalid', async () => {
        const expenseId = 'invalid-expense-id'

        repositoryMock.delete.mockResolvedValue(false)

        const result = await deleteExpenseUseCase.execute(expenseId, userId)

        expect(result).toBe(false)
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1)
        expect(repositoryMock.delete).toHaveBeenCalledWith(expenseId, userId)
    })
})
