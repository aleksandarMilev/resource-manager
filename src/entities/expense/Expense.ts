import { InvalidExpenseError } from "./InvalidExpenseError"

const AmountMinValue = 0
const CategoryMinLength = 2
const CategoryMaxLength = 100
const DescriptionMinLength = 2
const DescriptionMaxLength = 2000

export class Expense {
    private readonly id: string
    private readonly amount: number
    private readonly category: string
    private readonly description: string
    private readonly date: Date
    private readonly userId: string

    constructor(
        id: string,
        amount: number, 
        category: string, 
        description: string, 
        date: Date,
        userId: string
    ) {
        Expense.Validate(amount, category, description)

        this.id = id
        this.amount = amount
        this.category = category
        this.description = description
        this.date = date
        this.userId = userId
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

    public get UserId(): string {
        return this.userId
    }

    private static Validate(amount: number, category: string, description: string): void {
        Expense.ValidateAmount(amount)
        Expense.ValidateCategory(category)
        Expense.ValidateDescription(description)
    }

    private static ValidateAmount(amount: number): void {
        if (amount <= AmountMinValue) {
            throw new InvalidExpenseError(`Amount should be greater than ${AmountMinValue}!`)
        }
    }

    private static ValidateCategory(category: string): void {
        if (category.length < CategoryMinLength || category.length > CategoryMaxLength) {
            throw new InvalidExpenseError(
                `Category length should be between ${CategoryMinLength} and ${CategoryMaxLength} characters!`
            )
        }
    }

    private static ValidateDescription(description: string): void {
        if (description.length < DescriptionMinLength || description.length > DescriptionMaxLength) {
            throw new InvalidExpenseError(
                `Description length should be between ${DescriptionMinLength} and ${DescriptionMaxLength} characters!`
            )
        }
    }
}
