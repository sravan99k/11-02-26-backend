import * as functions from 'firebase-functions';
import { FirestoreUserRepository } from '../../../infrastructure/database/FirestoreUserRepository';
import { FirebaseAuthService } from '../../../infrastructure/auth/FirebaseAuthService';
import { ValidateAndSyncUserUseCase } from '../../../application/use-cases/users/validateAndSyncUser.usecase';

const userRepo = new FirestoreUserRepository();
const authService = new FirebaseAuthService();
const useCase = new ValidateAndSyncUserUseCase(userRepo, authService);

export const validateUser = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const { uid, email } = context.auth.token;
        return await useCase.execute(uid, email || "");
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
