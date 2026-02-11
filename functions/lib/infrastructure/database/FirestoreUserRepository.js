"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreUserRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreUserRepository {
    async getById(id) {
        const snap = await firebase_admin_config_1.db.doc(users / +id).get();
        return snap.exists ? snap.data() : null;
    }
    async update(id, data) {
        await firebase_admin_config_1.db.doc(users / +id).update(data);
    }
    async getBySchool(schoolId) {
        const snap = await firebase_admin_config_1.db.collection("users").where("schoolId", "==", schoolId).get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}
exports.FirestoreUserRepository = FirestoreUserRepository;
//# sourceMappingURL=FirestoreUserRepository.js.map