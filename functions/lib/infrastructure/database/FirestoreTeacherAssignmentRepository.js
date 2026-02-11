"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreTeacherAssignmentRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreTeacherAssignmentRepository {
    getPath(schoolPath, teacherId) {
        return `${schoolPath}/assignments/_list/teachers/${teacherId}/students`;
    }
    async assignStudent(teacherId, studentId, schoolPath) {
        await firebase_admin_config_1.db.doc(`${this.getPath(schoolPath, teacherId)}/${studentId}`).set({
            assignedAt: new Date()
        });
    }
    async unassignStudent(teacherId, studentId, schoolPath) {
        await firebase_admin_config_1.db.doc(`${this.getPath(schoolPath, teacherId)}/${studentId}`).delete();
    }
    async listByTeacher(teacherId, schoolPath) {
        const snap = await firebase_admin_config_1.db.collection(this.getPath(schoolPath, teacherId)).get();
        return snap.docs.map(doc => doc.id);
    }
    async listByStudent(studentId, schoolPath) {
        return [];
    }
    async bulkAssign(teacherId, studentIds, schoolPath) {
        const batch = firebase_admin_config_1.db.batch();
        const base = this.getPath(schoolPath, teacherId);
        studentIds.forEach(sid => {
            batch.set(firebase_admin_config_1.db.doc(`${base}/${sid}`), { assignedAt: new Date() });
        });
        await batch.commit();
    }
}
exports.FirestoreTeacherAssignmentRepository = FirestoreTeacherAssignmentRepository;
//# sourceMappingURL=FirestoreTeacherAssignmentRepository.js.map