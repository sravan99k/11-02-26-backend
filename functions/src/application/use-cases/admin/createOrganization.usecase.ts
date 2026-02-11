import { IOrganizationRepository, Organization } from "../../../domain/repositories/IOrganizationRepository";
import { IAuthService } from "../../../application/services/IAuthService";

export class CreateOrganizationUseCase {
    constructor(
        private orgRepo: IOrganizationRepository,
        private IAuthService: IAuthService
    ) { }

    async execute(data: { name: string; adminEmail: string }) {
        // 1. Domain Validation
        if (!data.name || !data.adminEmail) {
            throw new Error("Organization name and admin email are required.");
        }

        // 2. Create Organization Record
        const org: Organization = {
            name: data.name,
            adminEmail: data.adminEmail,
            createdAt: new Date(),
            status: 'active'
        };

        const orgId = await this.orgRepo.create(org);

        // 3. Logic for sending invitation or creating admin account...
        // This coordinates multiple services (Repo, Auth, maybe Email)

        return { orgId, ...org };
    }
}
