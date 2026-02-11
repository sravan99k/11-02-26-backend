import { db } from "../../shared/config/firebase-admin.config";
import { IAssessmentAssignmentRepository, AssessmentAssignment } from "../../domain/repositories/IAssessmentAssignmentRepository";

export class FirestoreAssessmentAssignmentRepository implements IAssessmentAssignmentRepository {
    async create(assignment: AssessmentAssignment): Promise<string> {
        const docRef = await db.collection("assessment_assignments").add(assignment);
        return docRef.id;
    }

    async listBySchool(schoolId: string): Promise<AssessmentAssignment[]> {
        const snap = await db.collection("assessment_assignments")
            .where("schoolId", "==", schoolId)
            .get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssessmentAssignment));
    }

    async getById(id: string): Promise<AssessmentAssignment | null> {
        const snap = await db.collection("assessment_assignments").doc(id).get();
        return snap.exists ? (snap.data() as AssessmentAssignment) : null;
    }

    async update(id: string, data: Partial<AssessmentAssignment>): Promise<void> {
        await db.collection("assessment_assignments").doc(id).update(data);
    }
}
