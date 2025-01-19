import express from 'express'
import request from 'supertest'
import { validateExpenseMiddleware } from '../../../src/middlewares/expense/validator/ValidateExpenseMiddleware'

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

    it('should return 400 if amount is zero or negative', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 0,
                category: 'Food',
                description: 'Dinner',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"amount" must be a positive number'
        })
    })

    it('should return 400 if category is too short', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'F',
                description: 'Lunch',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"category" length must be at least 2 characters long'
        })
    })

    it('should return 400 if category is too long', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'A'.repeat(101),
                description: 'Lunch',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"category" length must be less than or equal to 100 characters long'
        })
    })

    it('should return 400 if description is too short', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'Food',
                description: 'L',
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"description" length must be at least 2 characters long'
        })
    })

    it('should return 400 if description is too long', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'Food',
                description: 'A'.repeat(2001),
                date: '2025-01-15'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"description" length must be less than or equal to 2000 characters long'
        })
    })

    it('should return 400 if date is not valid', async () => {
        const response = await request(app)
            .post('/expenses')
            .send({
                amount: 100,
                category: 'Food',
                description: 'Dinner',
                date: 'invalid-date'
            })

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: '"date" must be a valid date'
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