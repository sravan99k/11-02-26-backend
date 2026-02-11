import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const bulkImportStudents = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { students } = data;
    const batch = admin.firestore().batch();
    students.forEach((s: any) => {
        const ref = admin.firestore().collection('students').doc();
        batch.set(ref, { ...s, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
    return { count: students.length };
});
