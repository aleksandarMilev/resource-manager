import request from 'supertest'
import express, { Request, Response, NextFunction } from 'express'
import router from '../../../src/routes/user/UserRoutes'
import { validateUserCredentialsMiddleware } from '../../../src/middlewares/user/validator/ValidateUserCredentialsMiddleware'
import { UserController } from '../../../src/controllers/user/UserController'

jest.mock('../../../src/middlewares/user/validator/ValidateUserCredentialsMiddleware')
jest.mock('../../../src/controllers/user/UserController')

describe('User Router', () => {

    const app = express()
    app.use(express.json())
    app.use('/user', router)

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('POST /user/register', () => {
        it('should validate user input and register user successfully', async () => {
            (validateUserCredentialsMiddleware as jest.Mock).mockImplementation(
                (req: Request, res: Response, next: NextFunction) => next()
            );

            (UserController.prototype.register as jest.Mock).mockImplementation(
                (req: Request, res: Response) => res.status(201).send({ message: 'User registered' })
            );

            const response = await request(app)
                .post('/user/register')
                .send({ email: 'test@mail.com', password: 'some-password' })

            expect(validateUserCredentialsMiddleware).toHaveBeenCalled()
            expect(UserController.prototype.register).toHaveBeenCalled()
            expect(response.status).toBe(201)
            expect(response.body.message).toBe('User registered')
        })

        it('should handle validation errors', async () => {
            (validateUserCredentialsMiddleware as jest.Mock).mockImplementation(
                (req: Request, res: Response) => res.status(400).send({ error: 'Invalid input' })
            );

            const response = await request(app)
                .post('/user/register')
                .send({ email: '', password: 'pas' })

            expect(validateUserCredentialsMiddleware).toHaveBeenCalled()
            expect(UserController.prototype.register).not.toHaveBeenCalled()
            expect(response.status).toBe(400)
            expect(response.body.error).toBe('Invalid input')
        })
    })

    describe('POST /user/login', () => {
        it('should validate user input and log in user successfully', async () => {
            (validateUserCredentialsMiddleware as jest.Mock).mockImplementation(
                (req: Request, res: Response, next: NextFunction) => next()
            );

            (UserController.prototype.login as jest.Mock).mockImplementation(
                (req: Request, res: Response) => res.status(200).send({ token: 'test-token' })
            );

            const response = await request(app)
                .post('/user/login')
                .send({ email: 'test@mail.com', password: 'some-password' })

            expect(validateUserCredentialsMiddleware).toHaveBeenCalled()
            expect(UserController.prototype.login).toHaveBeenCalled()
            expect(response.status).toBe(200)
            expect(response.body.token).toBe('test-token')
        })

        it('should handle invalid credentials', async () => {
            (validateUserCredentialsMiddleware as jest.Mock).mockImplementation(
                (req: Request, res: Response, next: NextFunction) => next()
            );
            
            (UserController.prototype.login as jest.Mock).mockImplementation(
                (req: Request, res: Response) => res.status(401).send({ error: 'Invalid credentials' })
            );

            const response = await request(app)
                .post('/user/login')
                .send({ email: 'test@mail.com', password: 'wrong-password' })

            expect(validateUserCredentialsMiddleware).toHaveBeenCalled()
            expect(UserController.prototype.login).toHaveBeenCalled()
            expect(response.status).toBe(401)
            expect(response.body.error).toBe('Invalid credentials')
        })
    })
})
