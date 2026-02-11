import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const deleteUser = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    // Only admins can delete users
    if (!context.auth || context.auth.token.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can delete users');
    }

    const { uid } = data;
    if (!uid) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing uid');
    }

    await admin.auth().deleteUser(uid);
    await admin.firestore().collection('users').doc(uid).delete();

    return { success: true };
});
