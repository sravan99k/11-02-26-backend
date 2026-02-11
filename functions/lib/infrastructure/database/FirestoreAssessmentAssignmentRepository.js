"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreAssessmentAssignmentRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreAssessmentAssignmentRepository {
    async create(assignment) {
        const docRef = await firebase_admin_config_1.db.collection("assessment_assignments").add(assignment);
        return docRef.id;
    }
    async listBySchool(schoolId) {
        const snap = await firebase_admin_config_1.db.collection("assessment_assignments")
            .where("schoolId", "==", schoolId)
            .get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async getById(id) {
        const snap = await firebase_admin_config_1.db.collection("assessment_assignments").doc(id).get();
        return snap.exists ? snap.data() : null;
    }
    async update(id, data) {
        await firebase_admin_config_1.db.collection("assessment_assignments").doc(id).update(data);
    }
}
exports.FirestoreAssessmentAssignmentRepository = FirestoreAssessmentAssignmentRepository;
//# sourceMappingURL=FirestoreAssessmentAssignmentRepository.js.map