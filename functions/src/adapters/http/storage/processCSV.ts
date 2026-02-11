import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const processCSV = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { fileId, type } = data;
    // Trigger CSV processing engine
    return { success: true, processed: 0 };
});
