import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../application/services/IAuthService";

export class UpdateUserRoleUseCase {
    constructor(
        private userRepo: IUserRepository,
        private IAuthService: IAuthService
    ) { }

    async execute(uid: string, newRole: string) {
        // 1. Update Database
        await this.userRepo.update(uid, { role: newRole });

        // 2. Update Auth Custom Claims (for secure frontend routing)
        await this.IAuthService.updateUserClaims(uid, { role: newRole });

        return { success: true };
    }
}
