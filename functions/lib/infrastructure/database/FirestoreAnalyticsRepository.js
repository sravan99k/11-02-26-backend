"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreAnalyticsRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreAnalyticsRepository {
    async getSchoolStats(schoolId) {
        const snap = await firebase_admin_config_1.db.collection("school_stats").doc(schoolId).get();
        return snap.exists ? snap.data() : { studentCount: 0, aggregateRisk: 0 };
    }
    async getStudentProgress(studentId) {
        return {};
    }
    async saveAlert(alert) {
        await firebase_admin_config_1.db.collection("alerts").add(alert);
    }
}
exports.FirestoreAnalyticsRepository = FirestoreAnalyticsRepository;
//# sourceMappingURL=FirestoreAnalyticsRepository.js.map