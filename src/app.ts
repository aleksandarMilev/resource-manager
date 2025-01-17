import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/user/UserRoutes'
import expenseRoutes from './routes/expense/ExpenseRoutes'
import { notFoundHandler } from './middlewares/errors/ErrorMiddleware'
import { globalErrorHandler } from './middlewares/errors/ErrorMiddleware'

dotenv.config()

const app = express()

app
    .use(express.json())
    .use('api/user', userRoutes)
    .use('/api/expense', expenseRoutes)
    .use(notFoundHandler)
    .use(globalErrorHandler)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}...`))
