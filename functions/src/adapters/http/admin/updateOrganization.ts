import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const updateOrganization = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth || context.auth.token.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized');
    }

    const { id, ...updates } = data;
    if (!id) throw new functions.https.HttpsError('invalid-argument', 'Missing organization ID');

    await admin.firestore().collection('organizations').doc(id).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
});
