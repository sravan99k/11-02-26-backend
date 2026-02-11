export interface IWellnessRepository {
    saveMood(studentId: string, tenant: any, moodData: any): Promise<void>;
    getMoodHistory(studentId: string, tenant: any): Promise<any[]>;
}
