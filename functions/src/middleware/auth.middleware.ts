import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { ITenantContextService, TenantInfo } from '../application/services/ITenantContextService';
import { FirestoreTenantContextService } from '../infrastructure/database/FirestoreTenantContextService';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
}

const db = admin.firestore();
const tenantContextService = new FirestoreTenantContextService();

export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email: string;
        role: string;
        tenant: TenantInfo;
    };
}

/**
 * Firebase Authentication Middleware
 * 
 * This middleware:
 * 1. Verifies Firebase ID token from Authorization header
 * 2. Fetches user data from Firestore
 * 3. Builds TenantInfo object
 * 4. Attaches user context to request object
 */
export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Missing or invalid Authorization header'
            });
            return;
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        if (!decodedToken.uid) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid token: missing UID'
            });
            return;
        }

        // Fetch user data from Firestore
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        
        if (!userDoc.exists) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User not found in database'
            });
            return;
        }

        const userData = userDoc.data();

        // Validate required user data
        if (!userData.role) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'User role not defined'
            });
            return;
        }

        // Build TenantInfo object
        const tenantInfo: TenantInfo = {
            organizationId: userData.organizationId || null,
            schoolId: userData.schoolId || 'pending',
            isIndependent: userData.isIndependent || false
        };

        // Attach user context to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            role: userData.role,
            tenant: tenantInfo
        };

        console.log(`[authMiddleware] User authenticated:`, {
            uid: req.user.uid,
            role: req.user.role,
            tenant: req.user.tenant
        });

        next();
    } catch (error) {
        console.error('[authMiddleware] Authentication failed:', error);
        
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
};

/**
 * Role-based Access Control Middleware
 * 
 * This middleware enforces role-based access control
 */
export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Forbidden',
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
            return;
        }

        console.log(`[requireRole] Access granted:`, {
            uid: req.user.uid,
            role: req.user.role,
            allowedRoles
        });

        next();
    };
};

/**
 * Super Admin Access Middleware
 * 
 * This middleware allows Super Admin to bypass tenant isolation
 */
export const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
        });
        return;
    }

    if (req.user.role !== 'superAdmin') {
        res.status(403).json({
            error: 'Forbidden',
            message: 'Super Admin access required'
        });
        return;
    }

    console.log(`[requireSuperAdmin] Super Admin access granted:`, {
        uid: req.user.uid
    });

    next();
};

/**
 * Tenant Validation Middleware
 * 
 * This middleware ensures tenant context is valid
 */
export const requireTenant = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
        });
        return;
    }

    // Block users with pending assignment status
    if (req.user.role === 'student' && (!req.user.tenant.schoolId || req.user.tenant.schoolId === 'pending')) {
        res.status(403).json({
            error: 'Forbidden',
            message: 'User must be assigned to a school'
        });
        return;
    }

    console.log(`[requireTenant] Tenant validation passed:`, {
        uid: req.user.uid,
        tenant: req.user.tenant
    });

    next();
};