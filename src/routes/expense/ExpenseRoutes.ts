import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ExpenseController } from '../../controllers/expense/ExpenseController'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { GetAllExpensesUseCase } from '../../use-cases/expense/GetAllExpensesUseCase'
import { ExpenseRepository } from '../../repositories/expense/ExpenseRepository'
import { validateExpenseMiddleware } from '../../middlewares/expense/validator/ValidateExpenseMiddleware'
import { DeleteExpenseUseCase } from '../../use-cases/expense/DeleteExpenseUseCase'
import { GetTotalAmountForTheCurrentMonthUseCase } from '../../use-cases/expense/GetTotalAmountForTheCurrentMonthUseCase'

const prisma = new PrismaClient()
const repository = new ExpenseRepository(prisma)

const expenseController = new ExpenseController(
    new GetAllExpensesUseCase(repository),
    new GetTotalAmountForTheCurrentMonthUseCase(repository),
    new CreateExpenseUseCase(repository),
    new DeleteExpenseUseCase(repository))

const router = express.Router()

router.get('/', (req, res, next) => expenseController.getAll(req, res, next))
router.get('/total', (req, res, next) => expenseController.getTotalAmountForCurrentMonth(req, res, next))
router.post('/', validateExpenseMiddleware, (req, res, next) => expenseController.create(req, res, next))
router.delete('/:id', (req, res, next) => expenseController.delete(req, res, next))

export default router
