import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getWellnessData = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const userId = context.auth.uid;
    const mood = await admin.firestore().collection('moodHistory').where('userId', '==', userId).orderBy('date', 'desc').limit(30).get();
    const goals = await admin.firestore().collection('wellnessGoals').where('userId', '==', userId).get();
    return {
        moodHistory: mood.docs.map(doc => doc.data()),
        goals: goals.docs.map(doc => doc.data())
    };
});
