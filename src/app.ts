import express from 'express'
import { PrismaClient } from '@prisma/client'
import { ExpenseRepository } from './repositories/ExpenseRepository'
import { CreateExpenseUseCase } from './useCases/CreateExpenseUseCase'
import { ExpenseController } from './controllers/ExpenseController'

const prisma = new PrismaClient()
const expenseRepository = new ExpenseRepository(prisma)
const createExpenseUseCase = new CreateExpenseUseCase(expenseRepository)

const expenseController = new ExpenseController(createExpenseUseCase)

const app = express()

app.use(express.json())

app.post('/expenses', (req, res) => expenseController.createExpense(req, res))

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
