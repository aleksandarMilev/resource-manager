export class Expense {
    private readonly id: string
    private readonly amount: number
    private readonly category: string
    private readonly description: string
    private readonly date: Date

    constructor(
        id: string,
        amount: number, 
        category: string, 
        description: string, 
        date: Date
    ) {
        this.id = id
        this.amount = amount
        this.category = category
        this.description = description
        this.date = date
    }

    public get Id(): string {
        return this.id
    }

    public get Amount(): number {
        return this.amount
    }

    public get Category(): string {
        return this.category
    }

    public get Description(): string {
        return this.description
    }

    public get Date(): Date {
        return this.date
    }
}
