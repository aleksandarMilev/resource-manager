import express from 'express'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import authenticationMiddleware from '../../../src/middlewares/user/AuthenticationMiddleware'

jest.mock('jsonwebtoken')

const app = express()
app.use(express.json())

app.get('/protected', authenticationMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted', user: req.user })
})

describe('authenticationMiddleware', () => {
    const mockToken = 'mocked.jwt.token'
    const mockUserId = '12345'

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return 401 if token is missing', async () => {
        const response = await request(app).get('/protected')

        expect(response.status).toBe(401)
        expect(response.body.errorMessage).toBe('Authorization token missing!')
    })

    it('should return 403 if token is invalid', async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token')
        })

        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${mockToken}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Invalid token!')
    })

    it('should pass with a valid token and set req.user', async () => {
        (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId })

        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${mockToken}`)

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Access granted')
        expect(response.body.user).toEqual({ id: mockUserId })
    })
})