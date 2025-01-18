import express from 'express'
import { PrismaClient } from '@prisma/client'
import { validateUserCredentialsMiddleware } from '../../middlewares/user/validator/ValidateUserCredentialsMiddleware'
import { UserController } from '../../controllers/user/UserController'
import { RegisterUserUseCase } from '../../use-cases/user/RegisterUserUseCase'
import { UserRepository } from '../../repositories/user/UserRepository'
import { LoginUserUseCase } from '../../use-cases/user/LoginUserUseCase'

const prisma = new PrismaClient()
const repository = new UserRepository(prisma)
const registerUseCase = new RegisterUserUseCase(repository)
const loginUseCase = new LoginUserUseCase(repository)
const controller = new UserController(registerUseCase, loginUseCase)

const router = express.Router()

router.post(
    '/register',
    validateUserCredentialsMiddleware, 
    (req, res, next) => controller.register(req, res, next))

router.post(
    '/login', 
    validateUserCredentialsMiddleware,
    (req, res, next) => controller.login(req, res, next))

export default router
