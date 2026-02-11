import * as functions from 'firebase-functions';
import { FirestoreSchoolRepository } from '../../../infrastructure/database/FirestoreSchoolRepository';
import { CreateSchoolUseCase } from '../../../application/use-cases/admin/createSchool.usecase';

const schoolRepo = new FirestoreSchoolRepository();
const useCase = new CreateSchoolUseCase(schoolRepo);

export const createSchool = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    const { role } = context.auth.token;
    if (role !== 'admin' && role !== 'super_admin' && role !== 'organization') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized to create schools');
    }

    try {
        return await useCase.execute(data);
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
