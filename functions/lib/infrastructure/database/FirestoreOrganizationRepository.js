"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirestoreOrganizationRepository = void 0;
const firebase_admin_config_1 = require("../../shared/config/firebase-admin.config");
class FirestoreOrganizationRepository {
    async create(org) {
        const docRef = await firebase_admin_config_1.db.collection("organizations").add(org);
        return docRef.id;
    }
    async getById(id) {
        const snap = await firebase_admin_config_1.db.collection("organizations").doc(id).get();
        return snap.exists ? snap.data() : null;
    }
    async update(id, data) {
        await firebase_admin_config_1.db.collection("organizations").doc(id).update(data);
    }
    async list() {
        const snap = await firebase_admin_config_1.db.collection("organizations").get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}
exports.FirestoreOrganizationRepository = FirestoreOrganizationRepository;
//# sourceMappingURL=FirestoreOrganizationRepository.js.map