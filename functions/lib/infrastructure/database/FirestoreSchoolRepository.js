"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreSchoolRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreSchoolRepository {
    async create(school) {
        const docRef = await firebase_admin_config_1.db.collection("schools").add(school);
        return docRef.id;
    }
    async getByOrganization(orgId) {
        const snap = await firebase_admin_config_1.db.collection("schools").where("organizationId", "==", orgId).get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async getById(id) {
        const snap = await firebase_admin_config_1.db.collection("schools").doc(id).get();
        return snap.exists ? snap.data() : null;
    }
}
exports.FirestoreSchoolRepository = FirestoreSchoolRepository;
//# sourceMappingURL=FirestoreSchoolRepository.js.map