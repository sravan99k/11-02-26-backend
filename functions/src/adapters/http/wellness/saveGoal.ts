import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const saveGoal = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const goal = { ...data, userId: context.auth.uid, createdAt: admin.firestore.FieldValue.serverTimestamp() };
    await admin.firestore().collection('wellnessGoals').add(goal);
    return { success: true };
});
