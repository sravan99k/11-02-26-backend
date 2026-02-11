import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const updateSchool = functions.https.onCall(async (data: any, context: functions.https.CallableContext) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');

    const { id, ...updates } = data;
    if (!id) throw new functions.https.HttpsError('invalid-argument', 'Missing school ID');

    // Verify ownership if role is organization
    const doc = await admin.firestore().collection('schools').doc(id).get();
    if (!doc.exists) throw new functions.https.HttpsError('not-found', 'School not found');

    const schoolData = doc.data();
    if (context.auth.token.role === 'organization' && schoolData?.organizationId !== context.auth.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized to update this school');
    }

    await admin.firestore().collection('schools').doc(id).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
});
