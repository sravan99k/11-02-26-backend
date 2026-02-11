"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrganizationUseCase = void 0;
class CreateOrganizationUseCase {
    constructor(orgRepo, IAuthService) {
        this.orgRepo = orgRepo;
        this.IAuthService = IAuthService;
    }
    async execute(data) {
        if (!data.name || !data.adminEmail) {
            throw new Error("Organization name and admin email are required.");
        }
        const org = {
            name: data.name,
            adminEmail: data.adminEmail,
            createdAt: new Date(),
            status: 'active'
        };
        const orgId = await this.orgRepo.create(org);
        return { orgId, ...org };
    }
}
exports.CreateOrganizationUseCase = CreateOrganizationUseCase;
//# sourceMappingURL=createOrganization.usecase.js.map