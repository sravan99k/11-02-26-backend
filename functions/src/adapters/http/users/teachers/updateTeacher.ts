import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const updateTeacher = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { id, ...updates } = data;
    await admin.firestore().collection('teachers').doc(id).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
});
