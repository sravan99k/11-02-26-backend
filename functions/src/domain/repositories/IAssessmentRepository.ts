export interface IAssessmentRepository {
    saveResponse(response: any): Promise<void>;
    getLatestForStudent(studentId: string): Promise<any>;
    getHistoryForStudent(studentId: string): Promise<any[]>;
    // Add more methods as needed
}
