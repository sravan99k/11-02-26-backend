"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateAndSyncUserUseCase = void 0;
class ValidateAndSyncUserUseCase {
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    async execute(uid, email) {
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
            await this.userRepo.update(uid, user);
            await this.authService.updateUserClaims(uid, { role: 'student' });
        }
        return { ...user, isNew };
    }
}
exports.ValidateAndSyncUserUseCase = ValidateAndSyncUserUseCase;
//# sourceMappingURL=validateAndSyncUser.usecase.js.map