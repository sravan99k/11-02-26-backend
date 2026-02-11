import { IAssessmentAssignmentRepository, AssessmentAssignment } from "../../../domain/repositories/IAssessmentAssignmentRepository";

export class AssignAssessmentUseCase {
    constructor(private assignmentRepo: IAssessmentAssignmentRepository) { }

    async execute(data: {
        title: string;
        type: 'wellbeing' | 'cognitive' | 'behavioral' | 'academic' | 'social';
        studentIds: string[];
        schoolId: string;
        organizationId?: string;
        startDate: Date;
        endDate: Date;
    }) {
        if (!data.schoolId || data.studentIds.length === 0) {
            throw new Error("School ID and at least one student are required.");
        }

        const assignment: AssessmentAssignment = {
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

        // Coordination: In the future, send FCM notifications or Emails to students here

        return { assignmentId, ...assignment };
    }
}
