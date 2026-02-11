"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateScoreUseCase = void 0;
class CalculateScoreUseCase {
    execute(responses) {
        if (!responses || responses.length === 0)
            return 0;
        let totalScore = 0;
        let count = 0;
        responses.forEach(response => {
            if (response.score !== undefined && response.score !== null) {
                totalScore += response.score;
                count++;
            }
        });
        if (count === 0)
            return 0;
        const percentage = (totalScore / (count * 4)) * 100;
        return Math.round(percentage * 100) / 100;
    }
}
exports.CalculateScoreUseCase = CalculateScoreUseCase;
//# sourceMappingURL=calculateScore.usecase.js.map