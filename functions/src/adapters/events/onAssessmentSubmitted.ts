import * as functions from 'firebase-functions';
import { FirestoreAnalyticsRepository } from '../../infrastructure/database/FirestoreAnalyticsRepository';
import { FirestoreUserRepository } from '../../infrastructure/database/FirestoreUserRepository';
import { SendGridNotificationService } from '../../infrastructure/notifications/SendGridNotificationService';
import { HandleHighRiskInterventionUseCase } from '../../application/use-cases/assessment/handleHighRiskIntervention.usecase';

// Dependencies
const analyticsRepo = new FirestoreAnalyticsRepository();
const userRepo = new FirestoreUserRepository();
const notifyService = new SendGridNotificationService(); // Still need to create this mock/impl
const interventionUseCase = new HandleHighRiskInterventionUseCase(analyticsRepo, userRepo, notifyService);

export const onAssessmentSubmitted = functions.firestore
    .document('assessment_responses/{assessmentId}')
    .onCreate(async (snap) => {
        const assessment = snap.data();
        const { user_id, results } = assessment;

        // Trigger High Risk Workflow if needed
        if (results && results.overall >= 70) {
            await interventionUseCase.execute(user_id, 'High Risk', results.overall);
        }
    });
