import * as functions from 'firebase-functions';
import { FirestoreTeacherAssignmentRepository } from '../../../infrastructure/database/FirestoreTeacherAssignmentRepository';
import { AssignStudentsToTeacherUseCase } from '../../../application/use-cases/school/assignStudentsToTeacher.usecase';

const assignmentRepo = new FirestoreTeacherAssignmentRepository();
const useCase = new AssignStudentsToTeacherUseCase(assignmentRepo);

export const assignStudentsToTeacher = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }

    // Role check: Only management or admins can change assignments
    const { role } = context.auth.token;
    if (role !== 'management' && role !== 'admin' && role !== 'super_admin') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized to manage assignments');
    }

    try {
        return await useCase.execute(data);
    } catch (error: any) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
