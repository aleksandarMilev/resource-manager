import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const JwtSecretMissingErrorMessage = 'JWT_SECRET is required in the environment variables!'
const JwtExpiresInMissingErrorMessage = 'JWT_EXPIRES_IN is required in the environment variables!'

dotenv.config()

const JwtSecret = process.env.JWT_SECRET
const JwtExpiresIn = process.env.JWT_EXPIRES_IN

if (!JwtSecret) {
    throw new Error(JwtSecretMissingErrorMessage)
}

if (!JwtExpiresIn) {
    throw new Error(JwtExpiresInMissingErrorMessage)
}

export function generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, JwtSecret as string, { expiresIn: JwtExpiresIn })
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JwtSecret as string)
    } catch (err) {
        return null
    }
}