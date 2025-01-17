import { User } from "@prisma/client"

export interface IUserRepository {
    createUser(email: string, plainPassword: string, role?: string): Promise<boolean>
    deleteUser(email: string): Promise<boolean>
}