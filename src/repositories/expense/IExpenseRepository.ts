import { Expense } from '../../entities/expense/Expense'
import { ExpenseOutputModel } from './models/ExpenseOutputModel'

export interface IExpenseRepository {
    all(userId: string): Promise<ExpenseOutputModel[]>
    totalAmountForTheCurrentMonth(userId: string): Promise<number>
    create(expense: Expense): Promise<ExpenseOutputModel>
    delete(expenseId: string, userId: string): Promise<boolean>
}
