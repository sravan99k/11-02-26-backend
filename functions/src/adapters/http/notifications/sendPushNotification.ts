import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const sendPushNotification = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { userId, title, message } = data;
    // FCM logic
    return { success: true };
});
