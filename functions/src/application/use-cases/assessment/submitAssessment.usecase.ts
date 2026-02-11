import { IAssessmentRepository } from "../../../domain/repositories/IAssessmentRepository";
import { CalculateScoreUseCase } from "./calculateScore.usecase";
import { DetectRiskUseCase } from "./detectRisk.usecase";

interface SubmitAssessmentRequest {
    studentId: string;
    schoolPath: string;
    responses: any[];
}

export class SubmitAssessmentUseCase {
    constructor(
        private repository: IAssessmentRepository,
        private calculateScore: CalculateScoreUseCase,
        private detectRisk: DetectRiskUseCase
    ) { }

    async execute(request: SubmitAssessmentRequest) {
        const { studentId, schoolPath, responses } = request;

        // 1. Domain Logic
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

        // 2. Persistence via Repository
        const assessmentId = await this.repository.saveResponse(studentId, schoolPath, assessmentData);

        // 3. Denormalization (Update student summary)
        await this.repository.updateStudentLatestAssessment(studentId, schoolPath, {
            riskPercentage,
            riskCategory
        });

        return { assessmentId, riskPercentage, riskCategory };
    }
}
