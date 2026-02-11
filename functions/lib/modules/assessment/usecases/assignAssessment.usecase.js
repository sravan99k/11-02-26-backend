"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignAssessmentUseCase = void 0;
class AssignAssessmentUseCase {
    constructor(assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
    }
    async execute(data) {
        if (!data.schoolId || data.studentIds.length === 0) {
            throw new Error("School ID and at least one student are required.");
        }
        const assignment = {
            title: data.title,
            type: data.type,
            status: 'active',
            assignedStudentIds: data.studentIds,
            schoolId: data.schoolId,
            organizationId: data.organizationId,
            startDate: data.startDate,
            endDate: data.endDate
        };
        const assignmentId = await this.assignmentRepo.create(assignment);
        return { assignmentId, ...assignment };
    }
}
exports.AssignAssessmentUseCase = AssignAssessmentUseCase;
//# sourceMappingURL=assignAssessment.usecase.js.map