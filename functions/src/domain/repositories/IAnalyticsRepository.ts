export interface IAnalyticsRepository {
    getSchoolStats(schoolId: string): Promise<any>;
    getStudentProgress(studentId: string): Promise<any>;
    saveAlert(alert: any): Promise<void>;
}
