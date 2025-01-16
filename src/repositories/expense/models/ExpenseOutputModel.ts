export class ExpenseOutputModel {
    private readonly id: string
    private readonly amount: number
    private readonly category: string
    private readonly description: string
    private readonly date: string

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
