import { ITenantContextService, TenantInfo } from "../../application/services/ITenantContextService";

export class FirestoreTenantContextService implements ITenantContextService {
    resolvePath(tenant: TenantInfo, subPath: string): string {
        const basePath = tenant.isIndependent
            ? `users/${tenant.adminId}/schools/${tenant.schoolId}`
            : `users/${tenant.adminId}/organizations/${tenant.organizationId}/schools/${tenant.schoolId}`;

        return `${basePath}/${subPath}`.replace(/\/+$/, ''); // Ensure no trailing slash
    }

    // Add helper to create path for students, assessments, etc.
    getStudentsPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'students');
    }

    getAssessmentsPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'assessment_assignments');
    }
}
