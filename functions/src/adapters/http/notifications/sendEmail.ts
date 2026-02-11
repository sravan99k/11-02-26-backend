import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const sendEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { to, subject, body } = data;
    // Integration with SendGrid or other email provider
    return { success: true };
});
