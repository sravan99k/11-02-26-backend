"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitAssessmentUseCase = void 0;
class SubmitAssessmentUseCase {
    constructor(repository, calculateScore, detectRisk) {
        this.repository = repository;
        this.calculateScore = calculateScore;
        this.detectRisk = detectRisk;
    }
    async execute(request) {
        const { studentId, schoolPath, responses } = request;
        const riskPercentage = this.calculateScore.execute(responses);
        const riskCategory = this.detectRisk.execute(riskPercentage);
        const riskDistribution = this.detectRisk.calculateDistribution(responses);
        const assessmentData = {
            riskPercentage,
            riskCategory,
            riskDistribution,
            responses,
            totalQuestions: responses.length
        };
        const assessmentId = await this.repository.saveResponse(studentId, schoolPath, assessmentData);
        await this.repository.updateStudentLatestAssessment(studentId, schoolPath, {
            riskPercentage,
            riskCategory
        });
        return { assessmentId, riskPercentage, riskCategory };
    }
}
exports.SubmitAssessmentUseCase = SubmitAssessmentUseCase;
//# sourceMappingURL=submitAssessment.usecase.js.map