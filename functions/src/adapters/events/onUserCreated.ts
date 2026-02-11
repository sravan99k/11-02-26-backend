import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onUserCreated = functions.auth.user().onCreate(async (user: admin.auth.UserRecord) => {
    await admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        role: 'student' // Default role
    });
});
