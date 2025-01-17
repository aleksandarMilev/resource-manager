import express from 'express'
import { UserController } from '../../controllers/user/UserController'
import { RegisterUserUseCase } from '../../use-cases/user/RegisterUserUseCase'
import { UserRepository } from '../../repositories/user/UserRepository'
import { PrismaClient } from '@prisma/client'
import { LoginUserUseCase } from '../../use-cases/user/LoginUserUseCase'

const prisma = new PrismaClient()
const repository = new UserRepository(prisma)
const registerUseCase = new RegisterUserUseCase(repository)
const loginUseCase = new LoginUserUseCase(repository)
const userController = new UserController(registerUseCase, loginUseCase)

const router = express.Router()

router.post('/register', (req, res, next) => userController.register(req, res, next))
router.post('/login', (req, res, next) => userController.login(req, res, next))

export default router
