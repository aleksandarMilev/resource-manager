import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/expense/ExpenseRoutes'

dotenv.config()

const app = express()

app
    .use(express.json())
    .use('/api/expense', routes)  

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}`))
