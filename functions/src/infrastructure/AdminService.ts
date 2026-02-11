import * as admin from 'firebase-admin';
import { createUniqueSlug } from '../utils/slug';
import { z } from 'zod';

const OrganizationSchema = z.object({
    name: z.string().min(2),
    type: z.enum(['NGO', 'CORPORATE', 'GOVERNMENT', 'ORGANIZATION']),
    location: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    adminName: z.string().optional(),
});

const SchoolSchema = z.object({
    name: z.string().min(2),
    location: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    adminName: z.string().optional(),
    organizationId: z.string().nullable().optional(),
});

export class AdminService {
    private db = admin.firestore();

    async createOrganization(data: any) {
        const validated = OrganizationSchema.parse(data);
        const { name, type, location, email, password, phone, adminName } = validated;

        try {
            // Create Auth User
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: adminName || name,
            });

            // Set Role
            await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'organization' });

            // Slug
            const orgSlug = await createUniqueSlug(this.db, 'organizations', name);

            // Document
            await this.db.collection('organizations').doc(orgSlug).set({
                name,
                type,
                location,
                email,
                phone,
                adminName,
                organizationUserId: userRecord.uid,
                status: 'active',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            // User Profile
            await this.db.collection('users').doc(userRecord.uid).set({
                email,
                role: 'organization',
                name: adminName || name,
                organizationId: orgSlug,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active',
            });

            return { organizationId: orgSlug, uid: userRecord.uid };
        } catch (error: any) {
            console.error('Error creating organization:', error);
            throw error;
        }
    }

    async createSchool(data: any, creatorRole: string, creatorUid: string) {
        const validated = SchoolSchema.parse(data);
        const { name, location, email, password, phone, adminName, organizationId } = validated;

        const finalOrgId = creatorRole === 'organization' ? creatorUid : organizationId;

        try {
            // Create Auth User
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: adminName || name,
            });

            // Set Role
            await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'management' });

            // Slug
            const schoolSlug = await createUniqueSlug(this.db, 'schools', name);

            // Document
            await this.db.collection('schools').doc(schoolSlug).set({
                name,
                location,
                email,
                phone,
                adminName,
                organizationId: finalOrgId || null,
                schoolUserId: userRecord.uid,
                status: 'active',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                isIndependent: !finalOrgId,
            });

            // User Profile
            await this.db.collection('users').doc(userRecord.uid).set({
                email,
                role: 'management',
                name: adminName || name,
                schoolId: schoolSlug,
                organizationId: finalOrgId || null,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                isIndependent: !finalOrgId,
            });

            return { schoolId: schoolSlug, uid: userRecord.uid };
        } catch (error: any) {
            console.error('Error creating school:', error);
            throw error;
        }
    }
}

export const adminService = new AdminService();
