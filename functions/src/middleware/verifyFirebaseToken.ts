import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = getFirestore();

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: 'student' | 'teacher' | 'schoolAdmin' | 'orgAdmin' | 'superAdmin';
    organizationId?: string;
    schoolId?: string;
  };
}

/**
 * Firebase Token Verification Middleware
 * 
 * This middleware:
 * 1. Verifies Firebase ID token from Authorization header
 * 2. Extracts user data from Firestore
 * 3. Attaches user context to request object
 * 4. Enforces tenant isolation at the middleware level
 */
export const verifyFirebaseToken = async (
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

    // Attach user context to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userData.role,
      organizationId: userData.organizationId,
      schoolId: userData.schoolId
    };

    console.log(`[verifyFirebaseToken] User authenticated:`, {
      uid: req.user.uid,
      role: req.user.role,
      organizationId: req.user.organizationId,
      schoolId: req.user.schoolId
    });

    next();
  } catch (error) {
    console.error('[verifyFirebaseToken] Token verification failed:', error);
    
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
 * and tenant isolation at the route level
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
      allowedRoles,
      organizationId: req.user.organizationId,
      schoolId: req.user.schoolId
    });

    next();
  };
};

/**
 * Tenant Isolation Middleware
 * 
 * This middleware enforces tenant isolation by ensuring
 * organizationId and schoolId are present for non-superAdmin users
 */
export const enforceTenantIsolation = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Authentication required'
    });
    return;
  }

  // Super admins can access all data
  if (req.user.role === 'superAdmin') {
    next();
    return;
  }

  // All other users must have tenant context
  if (!req.user.organizationId) {
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'Organization context required'
    });
    return;
  }

  // School-level roles must have school context
  if (['student', 'teacher', 'schoolAdmin'].includes(req.user.role) && !req.user.schoolId) {
    res.status(403).json({ 
      error: 'Forbidden',
      message: 'School context required'
    });
    return;
  }

  console.log(`[enforceTenantIsolation] Tenant validation passed:`, {
    uid: req.user.uid,
    role: req.user.role,
    organizationId: req.user.organizationId,
    schoolId: req.user.schoolId
  });

  next();
};
