import jwt from 'jsonwebtoken'
import { generateToken, verifyToken } from '../../../src/repositories/user/jwt-generator/JwtGenerator'

jest.mock('jsonwebtoken')

describe('JwtGenerator', () => {
    const userId = '123'
    const role = 'admin'
    const token = 'mockedToken'
    const secret = 'some-very-secret-and-long-string'
    const expiresIn = '7d'

    beforeAll(() => {
        process.env.JWT_SECRET = secret
        process.env.JWT_EXPIRES_IN = expiresIn
    })

    describe('generateToken', () => {
        it('should generate a valid token', () => {
            (jwt.sign as jest.Mock).mockReturnValue(token)

            const generatedToken = generateToken(userId, role)

            expect(generatedToken).toBe(token)
            expect(jwt.sign).toHaveBeenCalledWith({ userId, role }, secret, { expiresIn })
        })
    })

    describe('verifyToken', () => {
        it('should correctly decode token', () => {
            const decoded = { userId, role };
            (jwt.verify as jest.Mock).mockReturnValue(decoded)

            const result = verifyToken(token)

            expect(result).toBe(decoded)
            expect(jwt.verify).toHaveBeenCalledWith(token, secret)
        })

        it('should return null for invalid token', () => {
            (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token') })

            const result = verifyToken('invalidToken')

            expect(result).toBeNull()
        })
    })
})