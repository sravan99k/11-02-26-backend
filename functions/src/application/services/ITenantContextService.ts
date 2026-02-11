export interface TenantInfo {
    adminId: string;
    organizationId?: string;
    schoolId: string;
    isIndependent: boolean;
}

export interface ITenantContextService {
    resolvePath(tenant: TenantInfo, subPath: string): string;
}
