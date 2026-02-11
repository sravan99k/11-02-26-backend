import * as functions from "firebase-functions";
import { FirestoreAssessmentRepository } from "../../../infrastructure/database/FirestoreAssessmentRepository";
import { SubmitAssessmentUseCase } from "../../../application/use-cases/assessment/submitAssessment.usecase";
import { CalculateScoreUseCase } from "../../../application/use-cases/assessment/calculateScore.usecase";
import { DetectRiskUseCase } from "../../../application/use-cases/assessment/detectRisk.usecase";

// Initialize Dependencies
const repository = new FirestoreAssessmentRepository();
const calculateScore = new CalculateScoreUseCase();
const detectRisk = new DetectRiskUseCase();
const submitUseCase = new SubmitAssessmentUseCase(repository, calculateScore, detectRisk);

export const submitAssessment = functions.https.onCall(async (data, context) => {
    // 1. Auth Guard
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    const { assessmentId, responses, schoolPath } = data;

    if (!responses || !schoolPath) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing responses or school path.');
    }

    try {
        // 2. Execute Use Case
        const result = await submitUseCase.execute({
            studentId: context.auth.uid,
            schoolPath,
            responses
        });

        return {
            success: true,
            data: result
        };
    } catch (error: any) {
        console.error("[API submitAssessment] Error:", error);
        throw new functions.https.HttpsError('internal', error.message || 'Failed to submit assessment');
    }
});
