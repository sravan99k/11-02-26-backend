"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreAssessmentRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreAssessmentRepository {
    async saveResponse(studentId, schoolPath, assessmentData) {
        const assessmentsRef = firebase_admin_config_1.db.collection(`${schoolPath}/students/${studentId}/assessments`);
        const docRef = await assessmentsRef.add({
            ...assessmentData,
            createdAt: new Date(),
            assessmentDate: new Date()
        });
        return docRef.id;
    }
    async updateStudentLatestAssessment(studentId, schoolPath, summary) {
        const studentRef = firebase_admin_config_1.db.doc(`${schoolPath}/students/${studentId}`);
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
    async getHistoryForStudent(studentId, schoolPath) {
        const snap = await firebase_admin_config_1.db.collection(`${schoolPath}/students/${studentId}/assessments`)
            .orderBy('assessmentDate', 'desc')
            .get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async getLatestForStudent(studentId, schoolPath) {
        const snap = await firebase_admin_config_1.db.collection(`${schoolPath}/students/${studentId}/assessments`)
            .orderBy('assessmentDate', 'desc')
            .limit(1)
            .get();
        if (snap.empty)
            return null;
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
}
exports.FirestoreAssessmentRepository = FirestoreAssessmentRepository;
//# sourceMappingURL=FirestoreAssessmentRepository.js.map