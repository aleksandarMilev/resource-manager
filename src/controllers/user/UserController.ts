import { Request, Response, NextFunction } from 'express'
import { RegisterUserUseCase } from '../../use-cases/user/RegisterUserUseCase'
import { LoginUserUseCase } from '../../use-cases/user/LoginUserUseCase'

export class UserController {
    private registerUseCase: RegisterUserUseCase
    private loginUseCase: LoginUserUseCase

    constructor(
        registerUserUseCase: RegisterUserUseCase,
        loginUseCase: LoginUserUseCase
    ) {
        this.registerUseCase = registerUserUseCase
        this.loginUseCase = loginUseCase
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, role } = req.body
            const success = await this.registerUseCase.execute(email, password, role)

            if (success) {
                res.status(201).json({ message: 'User registered successfully!' })
            } else {
                res.status(400).json({ errorMessage: 'User already exists!' })
            }
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body
            const token = await this.loginUseCase.execute(email, password)

            if (token) {
                res.status(200).json({ token })
            } else {
                res.status(400).json({ errorMessage: 'Invalid email or password!' })
            }
        } catch (error) {
            next(error)
        }
    }
}
