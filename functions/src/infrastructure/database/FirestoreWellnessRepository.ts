import { db } from "../../shared/config/firebase-admin.config";
import { IWellnessRepository } from "../../domain/repositories/IWellnessRepository";
import { ITenantContextService } from "../../application/services/ITenantContextService";

export class FirestoreWellnessRepository implements IWellnessRepository {
    constructor(private tenantContextService: ITenantContextService) {}

    async saveMood(studentId: string, tenant: any, moodData: any): Promise<void> {
        const wellnessPath = this.tenantContextService.getWellnessPath(tenant);
        await db.collection(`${wellnessPath}/mood_entries`).add({
            studentId,
            ...moodData
        });
    }

    async getMoodHistory(studentId: string, tenant: any): Promise<any[]> {
        const wellnessPath = this.tenantContextService.getWellnessPath(tenant);
        const snap = await db.collection(`${wellnessPath}/mood_entries`)
            .where("studentId", "==", studentId)
            .orderBy("timestamp", "desc")
            .get();
        return snap.docs.map(doc => doc.data());
    }
}
