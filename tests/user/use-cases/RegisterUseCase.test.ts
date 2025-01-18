import { RegisterUserUseCase } from '../../../src/use-cases/user/RegisterUserUseCase'
import { IUserRepository } from '../../../src/repositories/user/IUserRepository'

describe('RegisterUserUseCase', () => {
    let registerUserUseCase: RegisterUserUseCase
    let mockRepository: IUserRepository

    const mockEmail = 'test@example.com'
    const mockPassword = 'hashed-password'
    const mockRole = 'USER'

    beforeEach(() => {
        mockRepository = {
            createUser: jest.fn(),
            getUserByEmail: jest.fn(),
            deleteUser: jest.fn()
        }

        registerUserUseCase = new RegisterUserUseCase(mockRepository)
    })

    it('should register the user and return true', async () => {
        (mockRepository.createUser as jest.Mock).mockResolvedValue(true)

        const result = await registerUserUseCase.execute(mockEmail, mockPassword, mockRole)

        expect(result).toBe(true)
        expect(mockRepository.createUser).toHaveBeenCalledWith(mockEmail, mockPassword, mockRole)
    })

    it('should return false if the user registration fails', async () => {
        (mockRepository.createUser as jest.Mock).mockResolvedValue(false)

        const result = await registerUserUseCase.execute(mockEmail, mockPassword, mockRole)

        expect(result).toBe(false)
        expect(mockRepository.createUser).toHaveBeenCalledWith(mockEmail, mockPassword, mockRole)
    })

    it('should set role "USER" if no role is provided', async () => {
        (mockRepository.createUser as jest.Mock).mockResolvedValue(true)

        const result = await registerUserUseCase.execute(mockEmail, mockPassword)

        expect(result).toBe(true)
        expect(mockRepository.createUser).toHaveBeenCalledWith(mockEmail, mockPassword, 'USER')
    })
})
