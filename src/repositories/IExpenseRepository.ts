import { Expense } from '../entities/Expense'

export interface IExpenseRepository {
    all(): Promise<Expense[]>
    create(expense: Expense): Promise<Expense>
    delete(id: string): Promise<void>
    totalForCurrentMonth(): Promise<number>
}
