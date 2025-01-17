export class User {
    private readonly id: string
    private readonly email: string
    private readonly role: string
    private readonly createdAt: Date
    private readonly updatedAt: Date | null

    constructor(
        id: string,
        email: string,
        role: string = 'USER',
        createdAt: Date,
        updatedAt: Date | null
    ) {
        this.id = id
        this.email = email
        this.role = role
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }

    public get Id(): string {
        return this.id
    }

    public get Email(): string {
        return this.email
    }

    public get Role(): string {
        return this.role
    }

    public get CreatedAt(): Date {
        return this.createdAt
    }

    public get UpdatedAt(): Date | null { 
        return this.updatedAt
    }
}
