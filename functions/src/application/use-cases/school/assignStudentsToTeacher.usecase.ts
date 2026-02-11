import { ITeacherAssignmentRepository } from "../../../domain/repositories/ITeacherAssignmentRepository";

export class AssignStudentsToTeacherUseCase {
    constructor(private assignmentRepo: ITeacherAssignmentRepository) { }

    async execute(data: {
        teacherId: string;
        studentIds: string[];
        schoolPath: string;
    }) {
        if (!data.teacherId || data.studentIds.length === 0) {
            throw new Error("Teacher ID and students are required.");
        }

        await this.assignmentRepo.bulkAssign(data.teacherId, data.studentIds, data.schoolPath);
        return { success: true, count: data.studentIds.length };
    }
}
