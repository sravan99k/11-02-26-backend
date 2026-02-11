import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getResults = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { studentId } = data;
    const results = await admin.firestore().collection('assessmentResults')
        .where('studentId', '==', studentId)
        .orderBy('date', 'desc')
        .get();
    return results.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
