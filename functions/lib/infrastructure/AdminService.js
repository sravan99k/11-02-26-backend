"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const admin = __importStar(require("firebase-admin"));
const slug_1 = require("../utils/slug");
const zod_1 = require("zod");
const OrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    type: zod_1.z.enum(['NGO', 'CORPORATE', 'GOVERNMENT', 'ORGANIZATION']),
    location: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    adminName: zod_1.z.string().optional(),
});
const SchoolSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    location: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    phone: zod_1.z.string().optional(),
    adminName: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().nullable().optional(),
});
class AdminService {
    constructor() {
        this.db = admin.firestore();
    }
    async createOrganization(data) {
        const validated = OrganizationSchema.parse(data);
        const { name, type, location, email, password, phone, adminName } = validated;
        try {
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: adminName || name,
            });
            await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'organization' });
            const orgSlug = await (0, slug_1.createUniqueSlug)(this.db, 'organizations', name);
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
            await this.db.collection('users').doc(userRecord.uid).set({
                email,
                role: 'organization',
                name: adminName || name,
                organizationId: orgSlug,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: 'active',
            });
            return { organizationId: orgSlug, uid: userRecord.uid };
        }
        catch (error) {
            console.error('Error creating organization:', error);
            throw error;
        }
    }
    async createSchool(data, creatorRole, creatorUid) {
        const validated = SchoolSchema.parse(data);
        const { name, location, email, password, phone, adminName, organizationId } = validated;
        const finalOrgId = creatorRole === 'organization' ? creatorUid : organizationId;
        try {
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName: adminName || name,
            });
            await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'management' });
            const schoolSlug = await (0, slug_1.createUniqueSlug)(this.db, 'schools', name);
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
        }
        catch (error) {
            console.error('Error creating school:', error);
            throw error;
        }
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
//# sourceMappingURL=AdminService.js.map