import { IUserRepository } from '../../repositories/user/IUserRepository'

export class RegisterUserUseCase {
    private repository: IUserRepository

    constructor(repository: IUserRepository) {
        this.repository = repository
    }

    async execute(email: string, password: string, role: string = 'USER'): Promise<boolean> {
        return await this.repository.createUser(email, password, role)
    }
}