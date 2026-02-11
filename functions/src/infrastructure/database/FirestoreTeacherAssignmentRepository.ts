import { db } from "../../shared/config/firebase-admin.config";
import { ITeacherAssignmentRepository } from "../../domain/repositories/ITeacherAssignmentRepository";

export class FirestoreTeacherAssignmentRepository implements ITeacherAssignmentRepository {
    private getPath(schoolPath: string, teacherId: string) {
        return `${schoolPath}/assignments/_list/teachers/${teacherId}/students`;
    }

    async assignStudent(teacherId: string, studentId: string, schoolPath: string): Promise<void> {
        await db.doc(`${this.getPath(schoolPath, teacherId)}/${studentId}`).set({
            assignedAt: new Date()
        });
    }

    async unassignStudent(teacherId: string, studentId: string, schoolPath: string): Promise<void> {
        await db.doc(`${this.getPath(schoolPath, teacherId)}/${studentId}`).delete();
    }

    async listByTeacher(teacherId: string, schoolPath: string): Promise<string[]> {
        const snap = await db.collection(this.getPath(schoolPath, teacherId)).get();
        return snap.docs.map(doc => doc.id);
    }

    async listByStudent(studentId: string, schoolPath: string): Promise<string[]> {
        // This is harder in the current schema because it's nested under teachers.
        // We might need a collectionGroup query or a dual-write if we need this often.
        // For now, let's look at how the legacy code did it.
        return [];
    }

    async bulkAssign(teacherId: string, studentIds: string[], schoolPath: string): Promise<void> {
        const batch = db.batch();
        const base = this.getPath(schoolPath, teacherId);
        studentIds.forEach(sid => {
            batch.set(db.doc(`${base}/${sid}`), { assignedAt: new Date() });
        });
        await batch.commit();
    }
}
