"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSchoolUseCase = void 0;
class CreateSchoolUseCase {
    constructor(schoolRepo) {
        this.schoolRepo = schoolRepo;
    }
    async execute(data) {
        if (!data.name || !data.orgId) {
            throw new Error("School name and Organization ID are required.");
        }
        const school = {
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
exports.CreateSchoolUseCase = CreateSchoolUseCase;
//# sourceMappingURL=createSchool.usecase.js.map