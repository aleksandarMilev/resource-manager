export class Expense {
    readonly id: string
    readonly amount: number
    readonly category: string
    readonly description: string
    readonly date: Date

    constructor(id: string, amount: number, category: string, description: string, date: Date) {
        this.id = id
        this.amount = amount
        this.category = category
        this.description = description
        this.date = date
    }
}
