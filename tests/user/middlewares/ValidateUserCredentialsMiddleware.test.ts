import express, { Request, Response } from 'express'
import request from 'supertest'
import { validateUserCredentialsMiddleware } from '../../../src/middlewares/user/validator/ValidateUserCredentialsMiddleware'

const app = express()
app.use(express.json())

app.post('/test-middleware', validateUserCredentialsMiddleware, (req: Request, res: Response) => {
    res.status(200).json({ message: 'Middleware passed' })
})

describe('validateUserCredentialsMiddleware', () => {
    it('should pass with valid email and password', async () => {
        const response = await request(app)
            .post('/test-middleware')
            .send({
                email: 'test@mail.com',
                password: '123456',
            })

        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Middleware passed')
    })

    it('should return error if email is invalid', async () => {
        const response = await request(app)
            .post('/test-middleware')
            .send({
                email: 'invalid-email',
                password: '123456',
            })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('"email" must be a valid email')
    })

    it('should return error if password is too short', async () => {
        const response = await request(app)
            .post('/test-middleware')
            .send({
                email: 'test@mail.com',
                password: '123',
            })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('"password" length must be at least 6 characters long')
    })

    it('should return error if password is too long', async () => {
        const longPassword = 'a'.repeat(51)
        const response = await request(app)
            .post('/test-middleware')
            .send({
                email: 'test@mail.com',
                password: longPassword,
            })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('"password" length must be less than or equal to 50 characters long')
    })

    it('should return error if email is missing', async () => {
        const response = await request(app)
            .post('/test-middleware')
            .send({
                password: '123456',
            })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('"email" is required')
    })

    it('should return error if password is missing', async () => {
        const response = await request(app)
            .post('/test-middleware')
            .send({
                email: 'test@mail.com',
            })

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('"password" is required')
    })

    it('should return error if body is empty', async () => {
        const response = await request(app).post('/test-middleware').send({})

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('"email" is required')
    })
})