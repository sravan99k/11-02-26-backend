import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const bulkImportTeachers = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { teachers } = data;
    const batch = admin.firestore().batch();
    teachers.forEach((t: any) => {
        const ref = admin.firestore().collection('teachers').doc();
        batch.set(ref, { ...t, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
    return { count: teachers.length };
});
