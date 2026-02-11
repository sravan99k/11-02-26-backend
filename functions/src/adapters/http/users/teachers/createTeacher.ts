import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createTeacher = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const teacher = { ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    const doc = await admin.firestore().collection('teachers').add(teacher);
    return { id: doc.id };
});
