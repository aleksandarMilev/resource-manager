import express from 'express'
import request from 'supertest'
import { validateExpenseMiddleware } from '../../src/middlewares/expense/validator/ValidateExpenseMiddleware'

const app = express()

app.use(express.json())

app.post('/expenses', validateExpenseMiddleware, (req, res) => {
    res.status(201).send('Expense created')
})

describe('Expense Validation Middleware', () => {
    it('should return 400 if amount is not provided', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                category: 'Food',
                description: 'Lunch',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"amount" is required'
        })
    })

    it('should return 400 if amount is negative', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: -100,
                category: 'Food',
                description: 'Dinner',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"amount" must be a positive number'
        })
    })

    it('should return 400 if category is missing', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                description: 'Dinner',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"category" is required'
        })
    })

    it('should return 400 if description is missing', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'Food',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"description" is required'
        })
    })

    it('should return 400 if date is missing', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'Food',
                description: 'Dinner'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"date" is required'
        })
    })

    it('should return 200 if all required fields are valid', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'Food',
                description: 'Dinner',
                date: '2025-01-15'
            })

        expect(response.status).toBe(201)
        expect(response.text).toBe('Expense created')
    })
})
