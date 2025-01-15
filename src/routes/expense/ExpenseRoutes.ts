import express from 'express'
import { ExpenseController } from '../../controllers/ExpenseController'
import { CreateExpenseUseCase } from '../../use-cases/CreateExpenseUseCase'
import { ExpenseRepository } from '../../repositories/ExpenseRepository'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const expenseRepository = new ExpenseRepository(prisma)
const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository)
const expenseController = new ExpenseController(createExpenseUseCase)

const router = express.Router()

router.post('/', (req, res) => expenseController.createExpense(req, res))

export default router
