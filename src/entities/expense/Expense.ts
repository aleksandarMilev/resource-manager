import { v4 as uuidv4 } from 'uuid'

export class Expense {
    id: string
    amount: number
    category: string
    description: string
    date: Date

    constructor(amount: number, category: string, description: string, date: Date) {
        this.id = uuidv4()
        this.amount = amount
        this.category = category
        this.description = description
        this.date = date
    }
}
