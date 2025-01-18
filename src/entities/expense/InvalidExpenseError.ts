export class InvalidExpenseError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "InvalidExpenseError"

        Object.setPrototypeOf(this, InvalidExpenseError.prototype)
    }
}
