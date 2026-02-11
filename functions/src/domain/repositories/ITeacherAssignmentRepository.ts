export interface TeacherAssignment {
    teacherId: string;
    studentId: string;
    schoolId: string;
}

export interface ITeacherAssignmentRepository {
    assignStudent(teacherId: string, studentId: string, schoolId: string): Promise<void>;
    unassignStudent(teacherId: string, studentId: string, schoolId: string): Promise<void>;
    listByTeacher(teacherId: string, schoolId: string): Promise<string[]>; // returns studentIds
    listByStudent(studentId: string, schoolId: string): Promise<string[]>; // returns teacherIds
    bulkAssign(teacherId: string, studentIds: string[], schoolId: string): Promise<void>;
}
