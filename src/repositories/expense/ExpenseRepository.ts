import { PrismaClient } from '@prisma/client'
import { Expense } from '../../entities/expense/Expense'
import { IExpenseRepository } from './IExpenseRepository'
import { ExpenseOutputModel } from './models/ExpenseOutputModel'

export class ExpenseRepository implements IExpenseRepository {
    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async all(userId: string): Promise<ExpenseOutputModel[]> {
        const expenses = await this.prisma.expense.findMany({
            where: { userId: userId } 
        })

        type Expense = { id: string; amount: number; category: string; description: string; date: Date }

        return expenses.map(
            (e: Expense) => 
                new ExpenseOutputModel(
                    e.id, 
                    e.amount, 
                    e.category, 
                    e.description, 
                    e.date.toISOString().split('T')[0]
                )
        )
    }

    async totalAmountForTheCurrentMonth(userId: string): Promise<number> {
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
                userId: userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        return total._sum.amount || 0
    }

    async create(expense: Expense): Promise<ExpenseOutputModel> {
        await this.prisma.expense.create({
            data: {
                id: expense.Id,
                amount: expense.Amount,
                category: expense.Category,
                description: expense.Description,
                date: expense.Date,
                userId: expense.UserId
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

    async delete(expenseId: string, userId: string): Promise<boolean> {
        const expense = await this.prisma.expense.findFirst({
            where: { id: expenseId }
        })

        if(!expense || expense.userId !== userId) {
            return false
        }

        await this.prisma.expense.delete({
            where: { id: expenseId }
        })

        return true
    }
}