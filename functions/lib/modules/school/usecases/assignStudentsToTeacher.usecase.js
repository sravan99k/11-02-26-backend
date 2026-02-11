"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignStudentsToTeacherUseCase = void 0;
class AssignStudentsToTeacherUseCase {
    constructor(assignmentRepo) {
        this.assignmentRepo = assignmentRepo;
    }
    async execute(data) {
        if (!data.teacherId || data.studentIds.length === 0) {
            throw new Error("Teacher ID and students are required.");
        }
        await this.assignmentRepo.bulkAssign(data.teacherId, data.studentIds, data.schoolPath);
        return { success: true, count: data.studentIds.length };
    }
}
exports.AssignStudentsToTeacherUseCase = AssignStudentsToTeacherUseCase;
//# sourceMappingURL=assignStudentsToTeacher.usecase.js.map