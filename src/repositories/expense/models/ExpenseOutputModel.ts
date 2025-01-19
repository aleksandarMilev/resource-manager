export class ExpenseOutputModel {
    readonly id: string
    readonly amount: number
    readonly category: string
    readonly description: string
    readonly date: string

    constructor(
        id: string,
        amount: number, 
        category: string, 
        description: string, 
        date: string
    ) {
        this.id = id
        this.amount = amount
        this.category = category
        this.description = description
        this.date = date
    }
}