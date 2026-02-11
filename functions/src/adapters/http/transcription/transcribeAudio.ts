import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const transcribeAudio = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    const { audioUrl } = data;
    // Call Google Speech-to-Text
    return { transcription: "Placeholder text" };
});
