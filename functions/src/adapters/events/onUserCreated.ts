import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onUserCreated = functions.auth.user().onCreate(async (user: admin.auth.UserRecord) => {
    try {
        // Check if user already has tenant context (created by AdminService)
        const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            console.log(`[onUserCreated] User ${user.uid} already has tenant context, skipping creation`);
            return;
        }

        // For regular signup without tenant context, create as independent user
        // This will be updated later when assigned to organization/school
        await admin.firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            name: user.displayName || user.email,
            role: 'student', // Default role
            schoolId: 'pending', // Will be updated when assigned to school
            organizationId: null, // Will be updated when assigned to organization
            adminId: null, // Will be updated when assigned to organization
            isIndependent: false, // Will be updated based on context
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending_assignment' // Indicates user needs tenant assignment
        });

        console.log(`[onUserCreated] Created pending user: ${user.uid}`);
    } catch (error) {
        console.error('[onUserCreated] Error creating user:', error);
    }
});
