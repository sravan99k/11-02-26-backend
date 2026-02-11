"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreTenantContextService = void 0;
class FirestoreTenantContextService {
    resolvePath(tenant, subPath) {
        const basePath = tenant.isIndependent
            ? `users/${tenant.adminId}/schools/${tenant.schoolId}`
            : `users/${tenant.adminId}/organizations/${tenant.organizationId}/schools/${tenant.schoolId}`;
        return `${basePath}/${subPath}`.replace(/\/+$/, '');
    }
    getStudentsPath(tenant) {
        return this.resolvePath(tenant, 'students');
    }
    getAssessmentsPath(tenant) {
        return this.resolvePath(tenant, 'assessment_assignments');
    }
}
exports.FirestoreTenantContextService = FirestoreTenantContextService;
//# sourceMappingURL=FirestoreTenantContextService.js.map