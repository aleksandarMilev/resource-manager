import Joi from 'joi'

const expenseSchema = Joi.object({
    amount: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required()
})

export class ExpenseValidator {
    static validateExpense(data: any) {
        const { error } = expenseSchema.validate(data)
        return error
    }
}
