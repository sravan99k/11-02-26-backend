import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const saveMood = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const mood = { ...data, userId: context.auth.uid, date: admin.firestore.FieldValue.serverTimestamp() };
    await admin.firestore().collection('moodHistory').add(mood);
    return { success: true };
});
