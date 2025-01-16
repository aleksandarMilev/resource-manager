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

router.get('/', (req, res) => expenseController.getAll(req, res))
router.get('/total', (req, res) => expenseController.getTotalAmountForCurrentMonth(req, res))
router.post('/', validateExpenseMiddleware, (req, res) => expenseController.create(req, res))
router.delete('/:id', (req, res) => expenseController.delete(req, res))

export default router
