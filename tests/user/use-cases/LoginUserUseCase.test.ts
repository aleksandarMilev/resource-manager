import bcrypt from 'bcrypt'
import { LoginUserUseCase } from '../../../src/use-cases/user/LoginUserUseCase'
import { IUserRepository } from '../../../src/repositories/user/IUserRepository'
import { generateToken } from '../../../src/repositories/user/jwt-generator/JwtGenerator'

jest.mock('bcrypt')
jest.mock('../../../src/repositories/user/jwt-generator/JwtGenerator')

describe('LoginUserUseCase', () => {
    let loginUserUseCase: LoginUserUseCase
    let mockRepository: IUserRepository

    const mockEmail = 'test@mail.com'
    const mockPassword = 'some-password'
    const mockUser = { id: 'user-123', email: mockEmail, password: 'hashed-password', role: 'USER' }
    const mockToken = 'mock-jwt-token'

    beforeEach(() => {
        mockRepository = {
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
            deleteUser: jest.fn()
        }

        loginUserUseCase = new LoginUserUseCase(mockRepository)
    })

    it('should return a token when the user exists and the password is correct', async () => {
        (mockRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (generateToken as jest.Mock).mockReturnValue(mockToken)

        const result = await loginUserUseCase.execute(mockEmail, mockPassword)

        expect(result).toBe(mockToken)
        expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(mockEmail)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.password)
        expect(generateToken).toHaveBeenCalledWith(mockUser.id, mockUser.role)
    })

    it('should return null when the password is incorrect', async () => {
        (mockRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false)

        const result = await loginUserUseCase.execute(mockEmail, mockPassword)

        expect(result).toBeNull()
        expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(mockEmail)
        expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.password)
    })

    it('should return null when the user does not exist', async () => {
        (mockRepository.getUserByEmail as jest.Mock).mockResolvedValue(null)

        const result = await loginUserUseCase.execute(mockEmail, mockPassword)

        expect(result).toBeNull()
        expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(mockEmail)
    })
})