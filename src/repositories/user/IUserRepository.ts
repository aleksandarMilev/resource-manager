export interface IUserRepository {
    getUserByEmail(email: string): Promise<any | null>
    createUser(email: string, plainPassword: string, role?: string): Promise<boolean>
    deleteUser(email: string): Promise<boolean>
}