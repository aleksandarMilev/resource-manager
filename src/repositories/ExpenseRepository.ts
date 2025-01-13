import { PrismaClient } from '@prisma/client'
import { Expense } from '../entities/Expense'
import { IExpenseRepository } from './IExpenseRepository'

export class ExpenseRepository implements IExpenseRepository {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async create(expense: Expense): Promise<Expense> {
        const newExpense = await this.prisma.expense.create({
            data: {
                id: expense.id,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: expense.date
            }
        })

        return new Expense(
            newExpense.amount,
            newExpense.category,
            newExpense.description,
            newExpense.date
        )
    }

    async all(): Promise<Expense[]> {
        const expenses = await this.prisma.expense.findMany()
        return expenses.map(e => new Expense(e.amount, e.category, e.description, e.date))
    }

    async delete(id: string): Promise<void> {
        await this.prisma.expense.delete({
            where: { id }
        })
    }

    async totalForCurrentMonth(): Promise<number> {
        const startDate = new Date(
            new Date().getFullYear(), 
            new Date().getMonth(), 
            1)
            
        const endDate = new Date()

        const total = await this.prisma.expense.aggregate({
            _sum: {
                amount: true
            },
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        return total._sum.amount || 0
    }
}
