import express from 'express'
import { ExpenseController } from '../../controllers/expense/ExpenseController'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { ExpenseRepository } from '../../repositories/expense/ExpenseRepository'
import { PrismaClient } from '@prisma/client'
import { validateExpenseMiddleware } from '../../middlewares/expense/ValidateExpenseMiddleware'

const prisma = new PrismaClient()
const expenseRepository = new ExpenseRepository(prisma)
const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository)
const expenseController = new ExpenseController(createExpenseUseCase)

const router = express.Router()

router.post('/', validateExpenseMiddleware, (req, res) => expenseController.createExpense(req, res))

export default router
