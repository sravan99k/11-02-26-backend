import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getHistory = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { studentId } = data;
    const history = await admin.firestore().collection('assessments')
        .where('studentId', '==', studentId)
        .orderBy('createdAt', 'desc')
        .get();
    return history.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
