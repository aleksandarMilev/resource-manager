import { PrismaClient, User } from '@prisma/client'
import { UserRepository } from '../../../src/repositories/user/UserRepository'

jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            user: {
                create: jest.fn(),
                delete: jest.fn(),
                findUnique: jest.fn()
            }
        }))
    }
})

describe('UserRepository', () => {
    let prismaMock: jest.Mocked<PrismaClient>
    let repository: UserRepository

    const email = 'test@mail.com'
    const password = 'some-password'
    const role = 'USER'

    beforeEach(() => {
        prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>
        repository = new UserRepository(prismaMock)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should create a new user', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

        (prismaMock.user.create as jest.Mock).mockResolvedValue({
            email,
            password: 'hashedpassword',
            role,
            createdAt: new Date()
        })

        const result = await repository.createUser(email, password, role)

        expect(result).toBe(true) 
        expect(prismaMock.user.create).toHaveBeenCalledTimes(1)
    })

    it('should not create a user if user with same email already exists', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
            email,
            password: 'hashedpassword',
            role,
            createdAt: new Date()
        } as User)

        const result = await repository.createUser(email, password, role)

        expect(result).toBe(false) 
        expect(prismaMock.user.create).not.toHaveBeenCalled()
    })

    it('should delete user', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
            email,
            password: 'hashedpassword',
            role,
            createdAt: new Date(),
        } as User);

        (prismaMock.user.delete as jest.Mock).mockResolvedValue({
            email,
            password: 'hashedpassword',
            role,
            createdAt: new Date()
        })

        const result = await repository.deleteUser(email)

        expect(result).toBe(true) 
        expect(prismaMock.user.delete).toHaveBeenCalledTimes(1)
    })

    it('should return false if user with this email does not exist', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await repository.deleteUser(email)

        expect(result).toBe(false)
        expect(prismaMock.user.delete).not.toHaveBeenCalled() 
    })

    it('should return a user by email', async () => {
        const mockUser: User = {
            email,
            password: 'hashedpassword',
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
            id: 'user-1'
        };

        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

        const result = await repository.getUserByEmail(email)

        expect(result).toEqual(mockUser)
        expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1)
    })

    it('should return null if user is not found by email', async () => {
        (prismaMock.user.findUnique as jest.Mock).mockResolvedValue(null)

        const result = await repository.getUserByEmail(email)

        expect(result).toBeNull()
        expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1)
    })
})