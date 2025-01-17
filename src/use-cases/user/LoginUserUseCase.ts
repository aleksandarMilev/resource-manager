import bcrypt from 'bcrypt'
import { IUserRepository } from '../../repositories/user/IUserRepository'
import { generateToken } from '../../repositories/user/jwt/Jwt'

export class LoginUserUseCase {
    private repository: IUserRepository

    constructor(repository: IUserRepository) {
        this.repository = repository
    }

    async execute(email: string, plainPassword: string): Promise<string | null> {
        const user = await this.repository.getUserByEmail(email)

        if (user) {
            const isPasswordValid = await bcrypt.compare(plainPassword, user.password)

            if (isPasswordValid) {
                return generateToken(user.id, user.role)
            }

            return null
        }

        return null 
    }
}
