import * as functions from 'firebase-functions';
import { FirestoreAssessmentAssignmentRepository } from '../../../infrastructure/database/FirestoreAssessmentAssignmentRepository';
import { AssignAssessmentUseCase } from '../../../application/use-cases/assessment/assignAssessment.usecase';

const assignmentRepo = new FirestoreAssessmentAssignmentRepository();
const useCase = new AssignAssessmentUseCase(assignmentRepo);

export const assignAssessment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { role } = context.auth.token;
    if (role !== 'teacher' && role !== 'management' && role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized to assign assessments');
    }

    try {
        // Convert ISO strings from client to Date objects
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        return await useCase.execute({
            ...data,
            startDate,
            endDate
        });
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
