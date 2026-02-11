import { ISchoolRepository, School } from "../../../domain/repositories/ISchoolRepository";

export class CreateSchoolUseCase {
    constructor(private schoolRepo: ISchoolRepository) { }

    async execute(data: { name: string; orgId: string; location: string; principalEmail: string }) {
        if (!data.name || !data.orgId) {
            throw new Error("School name and Organization ID are required.");
        }

        const school: School = {
            name: data.name,
            organizationId: data.orgId,
            location: data.location,
            principalEmail: data.principalEmail,
            createdAt: new Date()
        };

        const schoolId = await this.schoolRepo.create(school);
        return { schoolId, ...school };
    }
}
