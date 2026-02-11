"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRoleUseCase = void 0;
class UpdateUserRoleUseCase {
    constructor(userRepo, authService) {
        this.userRepo = userRepo;
        this.authService = authService;
    }
    async execute(uid, newRole) {
        await this.userRepo.update(uid, { role: newRole });
        await this.authService.updateUserClaims(uid, { role: newRole });
        return { success: true };
    }
}
exports.UpdateUserRoleUseCase = UpdateUserRoleUseCase;
//# sourceMappingURL=updateUserRole.usecase.js.map