import { GetAllExpensesUseCase } from '../../../src/use-cases/expense/GetAllExpensesUseCase'
import { IExpenseRepository } from '../../../src/repositories/expense/IExpenseRepository'
import { ExpenseOutputModel } from '../../../src/repositories/expense/models/ExpenseOutputModel'

jest.mock('../../../src/repositories/expense/IExpenseRepository')

describe('GetAllExpensesUseCase', () => {
    let repositoryMock: jest.Mocked<IExpenseRepository>
    let getAllExpensesUseCase: GetAllExpensesUseCase
    const userId = 'user-123'

    beforeEach(() => {
        repositoryMock = {
            all: jest.fn(),
        } as unknown as jest.Mocked<IExpenseRepository>

        getAllExpensesUseCase = new GetAllExpensesUseCase(repositoryMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should return a list of all expenses', async () => {
        const mockExpenses: ExpenseOutputModel[] = [
            new ExpenseOutputModel('1', 100, 'Food', 'Groceries', '2025-01-01'),
            new ExpenseOutputModel('2', 50, 'Transport', 'Bus fare', '2025-01-02'),
        ]

        repositoryMock.all.mockResolvedValue(mockExpenses)

        const result = await getAllExpensesUseCase.execute(userId)

        expect(result).toEqual(mockExpenses)
        expect(repositoryMock.all).toHaveBeenCalledTimes(1)
        expect(repositoryMock.all).toHaveBeenCalledWith(userId)
    })

    it('should return an empty list if there are no expenses', async () => {
        const mockExpenses: ExpenseOutputModel[] = []

        repositoryMock.all.mockResolvedValue(mockExpenses)

        const result = await getAllExpensesUseCase.execute(userId)

        expect(result).toEqual(mockExpenses)
        expect(repositoryMock.all).toHaveBeenCalledTimes(1)
        expect(repositoryMock.all).toHaveBeenCalledWith(userId)
    })
})
