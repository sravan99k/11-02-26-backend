import { ITenantContextService, TenantInfo } from "../../application/services/ITenantContextService";

export class FirestoreTenantContextService implements ITenantContextService {
    resolvePath(tenant: TenantInfo, subPath: string): string {
        // Handle independent schools (no organization)
        if (tenant.isIndependent || !tenant.organizationId) {
            return `schools/${tenant.schoolId}/${subPath}`;
        }

        // Handle organization-based schools
        return `organizations/${tenant.organizationId}/schools/${tenant.schoolId}/${subPath}`;
    }

    // Add helper to create path for students, assessments, etc.
    getStudentsPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'students');
    }

    getAssessmentsPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'assessments');
    }

    getWellnessPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'wellness');
    }

    getAnalyticsPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'analytics');
    }

    getChatPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'chat');
    }

    getNotificationsPath(tenant: TenantInfo): string {
        return this.resolvePath(tenant, 'notifications');
    }

    // Super Admin platform-level access (bypasses tenant isolation)
    getPlatformPath(subPath: string): string {
        return `platform/${subPath}`;
    }
}
