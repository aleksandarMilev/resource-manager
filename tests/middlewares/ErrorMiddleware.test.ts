import request from 'supertest'
import express from 'express'
import { notFoundHandler, globalErrorHandler } from '../../src/middlewares/errors/ErrorMiddleware'

const app = express()

app.use(express.json())

app.get('/test', (req, res) => {
    res.send('Test route')
})

app.use(notFoundHandler)
app.use(globalErrorHandler)

describe('Error Handlers', () => {
    it('should return 404 for invalid routes', async () => {
        const response = await request(app).get('/non-existent-route')
        expect(response.status).toBe(404)
        expect(response.body).toEqual({
            errorMessage: 'Route /non-existent-route not found!'
        })
    })

    it('should handle errors and return 500 with error message', async () => {
        const appWithError = express()

        appWithError.use((req, res, next) => {
            const error = new Error('Internal Server Error!')
            next(error)
        })

        appWithError.use(globalErrorHandler)

        const response = await request(appWithError).get('/test')

        expect(response.status).toBe(500)
        expect(response.body).toEqual({
            errorMessage: 'Internal Server Error!'
        })
    })
})