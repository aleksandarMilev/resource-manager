import { Request, Response, NextFunction } from 'express'
import { RegisterUserUseCase } from '../../use-cases/user/RegisterUserUseCase'

export class UserController {
    private registerUseCase: RegisterUserUseCase

    constructor(registerUserUseCase: RegisterUserUseCase) {
        this.registerUseCase = registerUserUseCase
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, role } = req.body
            const success = await this.registerUseCase.execute(email, password, role)

            if (success) {
                res.status(201).json({ message: 'User registered successfully!' })
            } else {
                res.status(400).json({ error: 'User already exists!' })
            }
        } catch (error) {
            next(error)
        }
    }
}
