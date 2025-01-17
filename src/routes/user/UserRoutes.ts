import express from 'express'
import { UserController } from '../../controllers/user/UserController'
import { RegisterUserUseCase } from '../../use-cases/user/RegisterUserUseCase'
import { UserRepository } from '../../repositories/user/UserRepository'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const repository = new UserRepository(prisma)
const registerUseCase = new RegisterUserUseCase(repository)
const userController = new UserController(registerUseCase)

const router = express.Router()

router.post('/register', (req, res, next) => userController.register(req, res, next))

export default router
