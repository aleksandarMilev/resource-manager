import { Expense } from '../../entities/expense/Expense'
import { ExpenseOutputModel } from './models/ExpenseOutputModel'

export interface IExpenseRepository {
    all(): Promise<ExpenseOutputModel[]>
    create(expense: Expense): Promise<ExpenseOutputModel>
    delete(id: string): Promise<boolean>
    totalForCurrentMonth(): Promise<number>
}
