import { db } from "../../shared/config/firebase-admin.config";
import { IAssessmentRepository } from "../../domain/repositories/IAssessmentRepository";

export class FirestoreAssessmentRepository implements IAssessmentRepository {
    async saveResponse(studentId: string, schoolPath: string, assessmentData: any): Promise<string> {
        const assessmentsRef = db.collection(`${schoolPath}/students/${studentId}/assessments`);
        const docRef = await assessmentsRef.add({
            ...assessmentData,
            createdAt: new Date(),
            assessmentDate: new Date()
        });
        return docRef.id;
    }

    async updateStudentLatestAssessment(studentId: string, schoolPath: string, summary: any): Promise<void> {
        const studentRef = db.doc(`${schoolPath}/students/${studentId}`);
        await studentRef.set({
            latestAssessment: {
                ...summary,
                assessmentDate: new Date(),
                wellbeingScore: Math.round(100 - summary.riskPercentage)
            },
            lastAssessmentDate: new Date(),
            riskLevel: summary.riskPercentage >= 70 ? 'high' : summary.riskPercentage >= 40 ? 'medium' : 'low'
        }, { merge: true });
    }

    async getHistoryForStudent(studentId: string, schoolPath: string): Promise<any[]> {
        const snap = await db.collection(`${schoolPath}/students/${studentId}/assessments`)
            .orderBy('assessmentDate', 'desc')
            .get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async getLatestForStudent(studentId: string, schoolPath: string): Promise<any> {
        const snap = await db.collection(`${schoolPath}/students/${studentId}/assessments`)
            .orderBy('assessmentDate', 'desc')
            .limit(1)
            .get();
        if (snap.empty) return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
}
