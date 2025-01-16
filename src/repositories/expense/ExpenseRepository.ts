import { PrismaClient } from '@prisma/client'
import { Expense } from '../../entities/expense/Expense'
import { IExpenseRepository } from './IExpenseRepository'
import { ExpenseOutputModel } from './models/ExpenseOutputModel'

export class ExpenseRepository implements IExpenseRepository {
    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async create(expense: Expense): Promise<ExpenseOutputModel> {
        await this.prisma.expense.create({
            data: {
                id: expense.Id,
                amount: expense.Amount,
                category: expense.Category,
                description: expense.Description,
                date: expense.Date
            }
        })

        return new ExpenseOutputModel(
            expense.Id,
            expense.Amount,
            expense.Category, 
            expense.Description, 
            expense.Date.toISOString().split('T')[0]
        )
    }

    async all(): Promise<ExpenseOutputModel[]> {
        const expenses = await this.prisma.expense.findMany()

        return expenses.map(e => new ExpenseOutputModel(
            e.id,
            e.amount,
            e.category, 
            e.description, 
            e.date.toISOString().split('T')[0]
        ))
    }

    async delete(id: string): Promise<boolean> {
        const expense = await this.prisma.expense.findFirst({
            where: { id }
        })

        if(!expense){
            return false
        }

        await this.prisma.expense.delete({
            where: { id }
        })

        return true
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
