import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ExpenseController } from '../../controllers/expense/ExpenseController'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { GetAllExpensesUseCase } from '../../use-cases/expense/GetAllExpensesUseCase'
import { ExpenseRepository } from '../../repositories/expense/ExpenseRepository'
import { validateExpenseMiddleware } from '../../middlewares/expense/validator/ValidateExpenseMiddleware'
import { DeleteExpenseUseCase } from '../../use-cases/expense/DeleteExpenseUseCase'

const prisma = new PrismaClient()
const expenseRepository = new ExpenseRepository(prisma)

const expenseController = new ExpenseController(
    new CreateExpenseUseCase(expenseRepository),
    new GetAllExpensesUseCase(expenseRepository),
    new DeleteExpenseUseCase(expenseRepository))

const router = express.Router()

router.get('/', (req, res) => expenseController.getAll(req, res))
router.post('/', validateExpenseMiddleware, (req, res) => expenseController.create(req, res))
router.delete('/:id', (req, res) => expenseController.delete(req, res))

export default router
