import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const getStudentProgress = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { studentId } = data;
    // Aggregate assessment scores over time
    const assessments = await admin.firestore().collection('assessmentResults')
        .where('studentId', '==', studentId)
        .orderBy('date', 'asc')
        .get();
    return assessments.docs.map((doc: any) => doc.data());
});
