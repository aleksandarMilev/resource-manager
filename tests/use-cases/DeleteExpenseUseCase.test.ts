import { DeleteExpenseUseCase } from '../../src/use-cases/expense/DeleteExpenseUseCase'
import { IExpenseRepository } from '../../src/repositories/expense/IExpenseRepository'

jest.mock('../../src/repositories/expense/IExpenseRepository')

describe('DeleteExpenseUseCase', () => {
    let repositoryMock: jest.Mocked<IExpenseRepository>
    let deleteExpenseUseCase: DeleteExpenseUseCase

    beforeEach(() => {
        repositoryMock = {
            delete: jest.fn(),
        } as unknown as jest.Mocked<IExpenseRepository>

        deleteExpenseUseCase = new DeleteExpenseUseCase(repositoryMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should delete an expense successfully and return true', async () => {
        const expenseId = '123'

        repositoryMock.delete.mockResolvedValue(true)

        const result = await deleteExpenseUseCase.execute(expenseId)

        expect(result).toBe(true)
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1)
        expect(repositoryMock.delete).toHaveBeenCalledWith(expenseId)
    })

    it('should return false if the expense does not exist', async () => {
        const expenseId = 'non-existent-id'

        repositoryMock.delete.mockResolvedValue(false)

        const result = await deleteExpenseUseCase.execute(expenseId)

        expect(result).toBe(false)
        expect(repositoryMock.delete).toHaveBeenCalledTimes(1)
        expect(repositoryMock.delete).toHaveBeenCalledWith(expenseId)
    })
})
