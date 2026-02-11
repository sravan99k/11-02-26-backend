"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearIncompleteAssessmentForUser = exports.saveIncompleteAssessmentForUser = exports.getIncompleteAssessmentForUser = void 0;
const firebase_1 = require("@/integrations/firebase");
const firestore_1 = require("firebase/firestore");
const getDocRef = (userId) => {
    return (0, firestore_1.doc)(firebase_1.db, "users", userId, "meta", "incompleteAssessment");
};
const getIncompleteAssessmentForUser = async (userId) => {
    try {
        const ref = getDocRef(userId);
        const snap = await (0, firestore_1.getDoc)(ref);
        if (!snap.exists())
            return null;
        const data = snap.data();
        if (!data || typeof data.startedAt !== "number")
            return null;
        return { ...data, userId };
    }
    catch (e) {
        console.error("[IncompleteAssessment] Failed to load incomplete assessment", e);
        return null;
    }
};
exports.getIncompleteAssessmentForUser = getIncompleteAssessmentForUser;
const saveIncompleteAssessmentForUser = async (userId, payload) => {
    try {
        const ref = getDocRef(userId);
        const data = { ...payload, userId };
        await (0, firestore_1.setDoc)(ref, data, { merge: true });
    }
    catch (e) {
        console.error("[IncompleteAssessment] Failed to save incomplete assessment", e);
    }
};
exports.saveIncompleteAssessmentForUser = saveIncompleteAssessmentForUser;
const clearIncompleteAssessmentForUser = async (userId) => {
    try {
        const ref = getDocRef(userId);
        await (0, firestore_1.deleteDoc)(ref);
    }
    catch (e) {
        console.error("[IncompleteAssessment] Failed to clear incomplete assessment", e);
    }
};
exports.clearIncompleteAssessmentForUser = clearIncompleteAssessmentForUser;
//# sourceMappingURL=incompleteAssessmentService.js.map