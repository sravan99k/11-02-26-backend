"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreWellnessRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreWellnessRepository {
    async saveMood(studentId, moodData) {
        await firebase_admin_config_1.db.collection("mood_entries").add({
            studentId,
            ...moodData
        });
    }
    async getMoodHistory(studentId) {
        const snap = await firebase_admin_config_1.db.collection("mood_entries")
            .where("studentId", "==", studentId)
            .orderBy("timestamp", "desc")
            .get();
        return snap.docs.map(doc => doc.data());
    }
}
exports.FirestoreWellnessRepository = FirestoreWellnessRepository;
//# sourceMappingURL=FirestoreWellnessRepository.js.map