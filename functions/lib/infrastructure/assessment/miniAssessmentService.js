"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeMiniForUser = exports.scheduleMiniForUser = exports.getMiniMetaForUser = exports.getPendingMiniForUser = void 0;
const firebase_1 = require("@/integrations/firebase");
const firestore_1 = require("firebase/firestore");
const getPendingMiniDocRef = (userId, grade, phase) => {
    const docId = `pendingMini_${grade}_${phase}`;
    return (0, firestore_1.doc)(firebase_1.db, "users", userId, "meta", docId);
};
const getPendingMiniForUser = async (userId, grade, phase) => {
    try {
        const ref = getPendingMiniDocRef(userId, grade, phase);
        const snap = await (0, firestore_1.getDoc)(ref);
        if (!snap.exists())
            return null;
        const data = snap.data();
        if (!data || data.status !== "scheduled")
            return null;
        return data;
    }
    catch (e) {
        console.error("[MiniAssessment] Failed to load pending mini", { userId, grade, phase }, e);
        return null;
    }
};
exports.getPendingMiniForUser = getPendingMiniForUser;
const getMiniMetaForUser = async (userId, grade, phase) => {
    try {
        const ref = getPendingMiniDocRef(userId, grade, phase);
        const snap = await (0, firestore_1.getDoc)(ref);
        if (!snap.exists())
            return null;
        const data = snap.data();
        if (!data)
            return null;
        return data;
    }
    catch (e) {
        console.error("[MiniAssessment] Failed to load mini meta", { userId, grade, phase }, e);
        return null;
    }
};
exports.getMiniMetaForUser = getMiniMetaForUser;
const scheduleMiniForUser = async (userId, payload) => {
    var _a, _b;
    try {
        const { grade, phase } = payload;
        const ref = getPendingMiniDocRef(userId, grade, phase);
        const sanitizeFlags = (flags) => {
            if (!flags)
                return undefined;
            const cleaned = {};
            for (const [key, value] of Object.entries(flags)) {
                if (value === undefined)
                    continue;
                cleaned[key] = Boolean(value);
            }
            return Object.keys(cleaned).length > 0 ? cleaned : undefined;
        };
        const cleanedFlags = sanitizeFlags(payload.flags);
        const cleanedNextMiniFlags = sanitizeFlags((_a = payload.nextMini) === null || _a === void 0 ? void 0 : _a.flags);
        const data = {
            grade: payload.grade,
            phase: payload.phase,
            assessmentId: payload.assessmentId,
            fromAssessmentId: payload.fromAssessmentId,
            fileKey: payload.fileKey,
            status: (_b = payload.status) !== null && _b !== void 0 ? _b : "scheduled",
            createdAt: (0, firestore_1.serverTimestamp)(),
            ...(payload.dueAt != null ? { dueAt: payload.dueAt } : {}),
            ...(payload.completedAt != null ? { completedAt: payload.completedAt } : {}),
            ...(cleanedFlags ? { flags: cleanedFlags } : {}),
            ...(payload.nextMini
                ? {
                    nextMini: {
                        assessmentId: payload.nextMini.assessmentId,
                        fileKey: payload.nextMini.fileKey,
                        ...(cleanedNextMiniFlags ? { flags: cleanedNextMiniFlags } : {}),
                    },
                }
                : {}),
        };
        await (0, firestore_1.setDoc)(ref, data, { merge: true });
    }
    catch (e) {
        console.error("[MiniAssessment] Failed to schedule mini assessment", { userId, payload }, e);
    }
};
exports.scheduleMiniForUser = scheduleMiniForUser;
const completeMiniForUser = async (userId, grade, phase) => {
    try {
        const ref = getPendingMiniDocRef(userId, grade, phase);
        await (0, firestore_1.setDoc)(ref, {
            status: "completed",
            completedAt: (0, firestore_1.serverTimestamp)(),
        }, { merge: true });
    }
    catch (e) {
        console.error("[MiniAssessment] Failed to mark mini as completed", { userId, grade, phase }, e);
    }
};
exports.completeMiniForUser = completeMiniForUser;
//# sourceMappingURL=miniAssessmentService.js.map