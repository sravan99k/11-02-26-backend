import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const updateUserRole = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    // Only admins can update roles
    if (!context.auth || context.auth.token.role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can update user roles');
    }

    const { uid, role } = data;
    if (!uid || !role) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing uid or role');
    }

    await admin.auth().setCustomUserClaims(uid, { role });
    await admin.firestore().collection('users').doc(uid).update({
        role,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
});
