import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../application/services/IAuthService";

export class ValidateAndSyncUserUseCase {
    constructor(
        private userRepo: IUserRepository,
        private IAuthService: IAuthService
    ) { }

    async execute(uid: string, email: string) {
        let user = await this.userRepo.getById(uid);
        let isNew = false;

        if (!user) {
            isNew = true;
            user = {
                uid,
                email,
                role: 'student',
                status: 'active',
                createdAt: new Date()
            };
            await this.userRepo.update(uid, user); // Repository handles creation/update

            // Set initial custom claims
            await this.IAuthService.updateUserClaims(uid, { role: 'student' });
        }

        return { ...user, isNew };
    }
}
