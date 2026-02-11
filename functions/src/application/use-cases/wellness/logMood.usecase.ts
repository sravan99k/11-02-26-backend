import { IWellnessRepository } from "../../../domain/repositories/IWellnessRepository";

export class LogMoodUseCase {
    constructor(private repository: IWellnessRepository) {}

    async execute(studentId: string, mood: string, note?: string) {
        const moodData = {
            mood,
            note,
            timestamp: new Date()
        };
        await this.repository.saveMood(studentId, moodData);
        return { success: true };
    }
}
