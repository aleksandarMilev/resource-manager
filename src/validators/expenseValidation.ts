import Joi from 'joi'

export const expenseSchema = Joi.object({
    amount: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required()
})
