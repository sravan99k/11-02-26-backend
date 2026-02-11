import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const deleteTeacher = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { id } = data;
    await admin.firestore().collection('teachers').doc(id).delete();
    return { success: true };
});
