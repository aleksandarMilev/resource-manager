import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { IUserRepository } from './IUserRepository'

export class UserRepository implements IUserRepository {
    private readonly prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async createUser(email: string, plainPassword: string, role: string = 'USER'): Promise<boolean> {
        const user = await this.getUserByEmail(email)

        if (user) {
            return false 
        }

        const hashedPassword = await bcrypt.hash(plainPassword, 10)

        await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                createdAt: new Date()
            }
        })

        return true
    }

    async deleteUser(email: string): Promise<boolean> {
        const user = await this.getUserByEmail(email)

        if (user) {
            await this.prisma.user.delete({
                where: { email }
            })
            
            return true 
        }

        return false 
    }

    async getUserByEmail(email: string): Promise<any | null> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        if(user){
            return {
                password: user.password,
                id: user.id,
                role: user.role
            }
        }

        return null
    }
}