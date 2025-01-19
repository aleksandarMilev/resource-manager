import express from 'express'
import request from 'supertest'
import { UserController } from '../../../src/controllers/user/UserController'
import { RegisterUserUseCase } from '../../../src/use-cases/user/RegisterUserUseCase'
import { LoginUserUseCase } from '../../../src/use-cases/user/LoginUserUseCase'

jest.mock('../../../src/use-cases/user/RegisterUserUseCase')
jest.mock('../../../src/use-cases/user/LoginUserUseCase')

const app = express()
app.use(express.json())

const registerUserUseCase = new RegisterUserUseCase({} as any)
const loginUserUseCase = new LoginUserUseCase({} as any)
const userController = new UserController(registerUserUseCase, loginUserUseCase)

app.post('/register', (req, res, next) => userController.register(req, res, next))
app.post('/login', (req, res, next) => userController.login(req, res, next))

describe('UserController', () => {
    describe('register', () => {
        it('should register a new user', async () => {
            (registerUserUseCase.execute as jest.Mock).mockResolvedValue(true)

            const response = await request(app)
                .post('/register')
                .send({ email: 'test@mail.com', password: 'some-password', role: 'user' })

            expect(response.status).toBe(201)
            expect(response.body.message).toBe('User registered successfully!')
        })

        it('should return an error if a user with same email already exists', async () => {
            (registerUserUseCase.execute as jest.Mock).mockResolvedValue(false)

            const response = await request(app)
                .post('/register')
                .send({ email: 'test@mail.com', password: 'some-password', role: 'user' });

            expect(response.status).toBe(400);
            expect(response.body.errorMessage).toBe('User with same email already exists!');
        });
    });

    describe('login', () => {
        it('should login a user', async () => {
            const token = 'fake-jwt-token';
            (loginUserUseCase.execute as jest.Mock).mockResolvedValue(token)

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@mail.com', password: 'some-password' })

            expect(response.status).toBe(200)
            expect(response.body.token).toBe(token)
        })

        it('should return an error if the credentials are invalid', async () => {
            (loginUserUseCase.execute as jest.Mock).mockResolvedValue(null)

            const response = await request(app)
                .post('/login')
                .send({ email: 'test@mail.com', password: 'invalid-password' })

            expect(response.status).toBe(400)
            expect(response.body.errorMessage).toBe('Invalid email or password!')
        })
    })
})