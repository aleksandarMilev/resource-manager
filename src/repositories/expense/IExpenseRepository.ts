import { Expense } from '../../entities/expense/Expense'
import { ExpenseOutputModel } from './models/ExpenseOutputModel'

export interface IExpenseRepository {
    all(): Promise<ExpenseOutputModel[]>
    totalAmountForTheCurrentMonth(): Promise<number>
    create(expense: Expense): Promise<ExpenseOutputModel>
    delete(id: string): Promise<boolean>
}
