import { CreateExpenseUseCase } from '../../src/use-cases/expense/CreateExpenseUseCase'
import { ExpenseRepository } from '../../src/repositories/expense/ExpenseRepository'
import { ExpenseOutputModel } from '../../src/repositories/expense/models/ExpenseOutputModel'

jest.mock('../../src/repositories/expense/ExpenseRepository')

describe('CreateExpenseUseCase', () => {
    let repositoryMock: jest.Mocked<ExpenseRepository>
    let createExpenseUseCase: CreateExpenseUseCase

    beforeEach(() => {
        repositoryMock = new ExpenseRepository({} as any) as jest.Mocked<ExpenseRepository> 
        createExpenseUseCase = new CreateExpenseUseCase(repositoryMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should create a new expense successfully', async () => {
        const amount = 100
        const category = 'Food'
        const description = 'Lunch'
        const date = new Date()

        const mockExpenseOutput = new ExpenseOutputModel(
            '123', 
            amount, 
            category, 
            description, 
            date.toISOString().split('T')[0])

        repositoryMock.create.mockResolvedValue(mockExpenseOutput)

        const result = await createExpenseUseCase.execute(amount, category, description, date)

        expect(result).toEqual(mockExpenseOutput)
        expect(repositoryMock.create).toHaveBeenCalledTimes(1)
        expect(repositoryMock.create).toHaveBeenCalledWith(expect.objectContaining({
            Id: expect.any(String),
            Amount: amount,
            Category: category,
            Description: description,
            Date: date
        }))
    })

    it('should handle invalid amount (negative value)', async () => {
        const amount = -100
        const category = 'Food'
        const description = 'Lunch'
        const date = new Date()

        await expect(createExpenseUseCase.execute(amount, category, description, date))
            .rejects
            .toThrow('Amount should be a positive value')

        expect(repositoryMock.create).not.toHaveBeenCalled()
    })
})
