import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const saveJournal = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const journal = { ...data, userId: context.auth.uid, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    await admin.firestore().collection('journals').add(journal);
    return { success: true };
});
