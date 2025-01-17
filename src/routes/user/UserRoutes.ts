import express from 'express'
import { PrismaClient } from '@prisma/client'
import { validateUserMiddleware } from '../../middlewares/user/validator/ValidateUserMiddleware'
import { UserController } from '../../controllers/user/UserController'
import { RegisterUserUseCase } from '../../use-cases/user/RegisterUserUseCase'
import { UserRepository } from '../../repositories/user/UserRepository'
import { LoginUserUseCase } from '../../use-cases/user/LoginUserUseCase'

const prisma = new PrismaClient()
const repository = new UserRepository(prisma)
const registerUseCase = new RegisterUserUseCase(repository)
const loginUseCase = new LoginUserUseCase(repository)
const userController = new UserController(registerUseCase, loginUseCase)

const router = express.Router()

router.post(
    '/register',
    validateUserMiddleware, 
    (req, res, next) => userController.register(req, res, next))

router.post(
    '/login', 
    validateUserMiddleware,
    (req, res, next) => userController.login(req, res, next))

export default router
