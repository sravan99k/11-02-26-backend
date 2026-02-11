import * as functions from 'firebase-functions';
import { FirestoreOrganizationRepository } from '../../../infrastructure/database/FirestoreOrganizationRepository';
import { FirebaseAuthService } from '../../../infrastructure/auth/FirebaseAuthService';
import { CreateOrganizationUseCase } from '../../../application/use-cases/admin/createOrganization.usecase';

const orgRepo = new FirestoreOrganizationRepository();
const authService = new FirebaseAuthService();
const useCase = new CreateOrganizationUseCase(orgRepo, authService);

export const createOrganization = functions.https.onCall(async (data, context) => {
    // RBAC: Only super_admin or admin can create organizations
    if (!context.auth || (context.auth.token.role !== 'admin' && context.auth.token.role !== 'super_admin')) {
        throw new functions.https.HttpsError('permission-denied', 'Only system admins can create organizations');
    }

    try {
        return await useCase.execute(data);
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
