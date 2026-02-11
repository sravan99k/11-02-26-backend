export interface TenantInfo {
    organizationId?: string; // Organization ID (optional)
    schoolId: string;       // School ID (required)
    isIndependent: boolean;  // True for independent schools
}

export interface ITenantContextService {
    resolvePath(tenant: TenantInfo, subPath: string): string;
}
