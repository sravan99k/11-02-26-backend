export interface IWellnessRepository {
    saveMood(studentId: string, moodData: any): Promise<void>;
    getMoodHistory(studentId: string): Promise<any[]>;
}
