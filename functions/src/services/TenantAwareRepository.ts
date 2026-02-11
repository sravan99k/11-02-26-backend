import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = getFirestore();

export interface TenantContext {
  organizationId: string;
  schoolId?: string;
  uid: string;
  role: string;
}

/**
 * Tenant-Aware Repository Service
 * 
 * This service enforces strict tenant isolation at the database layer.
 * ALL Firestore queries MUST go through this service to ensure
 * tenant isolation is never bypassed.
 */
export class TenantAwareRepository {
  private tenantContext: TenantContext;

  constructor(tenantContext: TenantContext) {
    if (!tenantContext.organizationId) {
      throw new Error('TenantContext must include organizationId');
    }

    this.tenantContext = tenantContext;
  }

  /**
   * Get tenant-aware query with mandatory organization filtering
   */
  private getTenantQuery(collectionName: string, additionalFilters: any[] = []) {
    const baseFilters = [
      where('organizationId', '==', this.tenantContext.organizationId)
    ];

    // Add school filtering for school-level roles
    if (this.tenantContext.schoolId && ['student', 'teacher', 'schoolAdmin'].includes(this.tenantContext.role)) {
      baseFilters.push(where('schoolId', '==', this.tenantContext.schoolId));
    }

    return query(
      collection(db, collectionName),
      ...baseFilters,
      ...additionalFilters
    );
  }

  /**
   * Get documents with tenant isolation
   */
  async getDocuments(collectionName: string, additionalFilters: any[] = []) {
    try {
      const q = this.getTenantQuery(collectionName, additionalFilters);
      const querySnapshot = await getDocs(q);
      
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`[TenantAwareRepository] Retrieved ${documents.length} documents from ${collectionName}`, {
        organizationId: this.tenantContext.organizationId,
        schoolId: this.tenantContext.schoolId,
        role: this.tenantContext.role
      });

      return documents;
    } catch (error) {
      console.error(`[TenantAwareRepository] Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get single document with tenant validation
   */
  async getDocument(collectionName: string, documentId: string) {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      const documentData = docSnapshot.data();

      // CRITICAL: Validate tenant ownership
      if (documentData.organizationId !== this.tenantContext.organizationId) {
        console.warn(`[TenantAwareRepository] Tenant isolation violation attempt:`, {
          documentId,
          documentOrgId: documentData.organizationId,
          userOrgId: this.tenantContext.organizationId,
          uid: this.tenantContext.uid
        });
        throw new Error('Access denied: Document belongs to different organization');
      }

      // Validate school ownership for school-level roles
      if (this.tenantContext.schoolId && ['student', 'teacher', 'schoolAdmin'].includes(this.tenantContext.role)) {
        if (documentData.schoolId !== this.tenantContext.schoolId) {
          console.warn(`[TenantAwareRepository] School isolation violation attempt:`, {
            documentId,
            documentSchoolId: documentData.schoolId,
            userSchoolId: this.tenantContext.schoolId,
            uid: this.tenantContext.uid
          });
          throw new Error('Access denied: Document belongs to different school');
        }
      }

      console.log(`[TenantAwareRepository] Document access validated:`, {
        collectionName,
        documentId,
        organizationId: this.tenantContext.organizationId,
        schoolId: this.tenantContext.schoolId
      });

      return {
        id: docSnapshot.id,
        ...documentData
      };
    } catch (error) {
      console.error(`[TenantAwareRepository] Error getting document ${documentId} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create document with tenant context
   */
  async createDocument(collectionName: string, documentData: any, documentId?: string) {
    try {
      // MANDATORY: Inject tenant context
      const dataWithTenant = {
        ...documentData,
        organizationId: this.tenantContext.organizationId,
        schoolId: this.tenantContext.schoolId,
        createdAt: new Date().toISOString(),
        createdBy: this.tenantContext.uid
      };

      const docRef = documentId 
        ? doc(db, collectionName, documentId)
        : doc(collection(db, collectionName));

      await setDoc(docRef, dataWithTenant);

      console.log(`[TenantAwareRepository] Document created:`, {
        collectionName,
        documentId: docRef.id,
        organizationId: this.tenantContext.organizationId,
        schoolId: this.tenantContext.schoolId
      });

      return {
        id: docRef.id,
        ...dataWithTenant
      };
    } catch (error) {
      console.error(`[TenantAwareRepository] Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update document with tenant validation
   */
  async updateDocument(collectionName: string, documentId: string, updateData: any) {
    try {
      // First validate tenant ownership
      await this.getDocument(collectionName, documentId);

      // Update with tenant context
      const dataWithTenant = {
        ...updateData,
        updatedAt: new Date().toISOString(),
        updatedBy: this.tenantContext.uid
      };

      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, dataWithTenant);

      console.log(`[TenantAwareRepository] Document updated:`, {
        collectionName,
        documentId,
        organizationId: this.tenantContext.organizationId,
        schoolId: this.tenantContext.schoolId
      });

      return true;
    } catch (error) {
      console.error(`[TenantAwareRepository] Error updating document ${documentId} in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete document with tenant validation
   */
  async deleteDocument(collectionName: string, documentId: string) {
    try {
      // First validate tenant ownership
      await this.getDocument(collectionName, documentId);

      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);

      console.log(`[TenantAwareRepository] Document deleted:`, {
        collectionName,
        documentId,
        organizationId: this.tenantContext.organizationId,
        schoolId: this.tenantContext.schoolId
      });

      return true;
    } catch (error) {
      console.error(`[TenantAwareRepository] Error deleting document ${documentId} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get tenant context for logging and debugging
   */
  getTenantInfo() {
    return {
      organizationId: this.tenantContext.organizationId,
      schoolId: this.tenantContext.schoolId,
      uid: this.tenantContext.uid,
      role: this.tenantContext.role
    };
  }
}

/**
 * Factory function to create tenant-aware repository
 */
export const createTenantRepository = (tenantContext: TenantContext): TenantAwareRepository => {
  return new TenantAwareRepository(tenantContext);
};
