import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ExpenseController } from '../../controllers/expense/ExpenseController'
import { CreateExpenseUseCase } from '../../use-cases/expense/CreateExpenseUseCase'
import { GetAllExpensesUseCase } from '../../use-cases/expense/GetAllExpensesUseCase'
import { ExpenseRepository } from '../../repositories/expense/ExpenseRepository'
import { validateExpenseMiddleware } from '../../middlewares/expense/validator/ValidateExpenseMiddleware'

const prisma = new PrismaClient()
const expenseRepository = new ExpenseRepository(prisma)
const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository)
const getAllExpensesUseCase = new GetAllExpensesUseCase(expenseRepository)
const expenseController = new ExpenseController(createExpenseUseCase, getAllExpensesUseCase)

const router = express.Router()

router.get(
    '/', 
    (req, res) => expenseController.getAll(req, res))

router.post(
    '/', 
    validateExpenseMiddleware, 
    (req, res) => expenseController.create(req, res))

export default router
