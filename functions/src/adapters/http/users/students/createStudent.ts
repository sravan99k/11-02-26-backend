import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createStudent = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const student = { ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    const doc = await admin.firestore().collection('students').add(student);
    return { id: doc.id };
});
