"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMoodUseCase = void 0;
class LogMoodUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(studentId, mood, note) {
        const moodData = {
            mood,
            note,
            timestamp: new Date()
        };
        await this.repository.saveMood(studentId, moodData);
        return { success: true };
    }
}
exports.LogMoodUseCase = LogMoodUseCase;
//# sourceMappingURL=logMood.usecase.js.map