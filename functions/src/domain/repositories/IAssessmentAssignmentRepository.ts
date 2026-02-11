export interface AssessmentAssignment {
    id?: string;
    title: string;
    type: 'wellbeing' | 'cognitive' | 'behavioral' | 'academic' | 'social';
    status: 'draft' | 'active' | 'completed' | 'archived';
    assignedStudentIds: string[];
    startDate: Date;
    endDate: Date;
    schoolId: string;
    organizationId?: string;
}

export interface IAssessmentAssignmentRepository {
    create(assignment: AssessmentAssignment): Promise<string>;
    listBySchool(schoolId: string): Promise<AssessmentAssignment[]>;
    getById(id: string): Promise<AssessmentAssignment | null>;
    update(id: string, data: Partial<AssessmentAssignment>): Promise<void>;
}
