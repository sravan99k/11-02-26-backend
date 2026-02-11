"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGradeAssessmentStats = exports.saveEnabledAssessments = exports.loadEnabledAssessments = void 0;
const firebase_1 = require("@/integrations/firebase");
const firestore_1 = require("firebase/firestore");
const getUserSchoolContext = async () => {
    if (!firebase_1.auth.currentUser)
        return null;
    const userRef = (0, firestore_1.doc)(firebase_1.db, "users", firebase_1.auth.currentUser.uid);
    const snap = await (0, firestore_1.getDoc)(userRef);
    if (!snap.exists())
        return null;
    const data = snap.data();
    const adminId = data.parentAdminId || firebase_1.auth.currentUser.uid;
    const schoolId = data.schoolId;
    let organizationId = data.organizationId || null;
    const isIndependent = data.isIndependent;
    const role = data.role;
    if (role === "student" &&
        !organizationId &&
        adminId &&
        adminId !== firebase_1.auth.currentUser.uid) {
        try {
            const adminRef = (0, firestore_1.doc)(firebase_1.db, "users", adminId);
            const adminSnap = await (0, firestore_1.getDoc)(adminRef);
            if (adminSnap.exists()) {
                const adminData = adminSnap.data();
                if (adminData && adminData.organizationId) {
                    organizationId = adminData.organizationId;
                }
            }
        }
        catch (e) {
            console.warn("[AssessmentManagement] Failed to load admin context for student", (e === null || e === void 0 ? void 0 : e.message) || e);
        }
    }
    if (!adminId || !schoolId)
        return null;
    return { adminId, schoolId, organizationId: organizationId || null, isIndependent };
};
const getConfigDocPath = async () => {
    const ctx = await getUserSchoolContext();
    if (!ctx)
        return null;
    const base = ctx.organizationId
        ? `users/${ctx.adminId}/organizations/${ctx.organizationId}/schools/${ctx.schoolId}`
        : `users/${ctx.adminId}/schools/${ctx.schoolId}`;
    return `${base}/config/assessmentEnablement`;
};
const loadEnabledAssessments = async () => {
    try {
        const path = await getConfigDocPath();
        console.log('[AssessmentManagement] Loading enabled assessments from path:', path);
        if (!path) {
            console.warn('[AssessmentManagement] No config path available (no school context)');
            return {};
        }
        const ref = (0, firestore_1.doc)(firebase_1.db, path);
        const snap = await (0, firestore_1.getDoc)(ref);
        if (!snap.exists()) {
            console.warn('[AssessmentManagement] Config document does not exist at path:', path);
            console.log('[AssessmentManagement] Creating default config document with empty assessments');
            try {
                await (0, firestore_1.setDoc)(ref, { enabledAssessments: {} }, { merge: true });
                console.log('[AssessmentManagement] Default config document created successfully');
            }
            catch (createError) {
                console.error('[AssessmentManagement] Failed to create default config document:', (createError === null || createError === void 0 ? void 0 : createError.message) || createError);
            }
            return {};
        }
        const data = snap.data();
        const enabledAssessments = (data.enabledAssessments || {});
        console.log('[AssessmentManagement] Loaded enabledAssessments:', enabledAssessments);
        return enabledAssessments;
    }
    catch (e) {
        console.error("[AssessmentManagement] Failed to load enabled assessments", e);
        return {};
    }
};
exports.loadEnabledAssessments = loadEnabledAssessments;
const saveEnabledAssessments = async (state) => {
    try {
        const path = await getConfigDocPath();
        if (!path)
            return;
        const ref = (0, firestore_1.doc)(firebase_1.db, path);
        await (0, firestore_1.setDoc)(ref, { enabledAssessments: state }, { merge: true });
    }
    catch (e) {
        console.error("[AssessmentManagement] Failed to save enabled assessments", e);
    }
};
exports.saveEnabledAssessments = saveEnabledAssessments;
const normalizeGradeDigits = (value) => {
    if (value == null)
        return "";
    const match = String(value).match(/\d+/);
    return match ? match[0] : "";
};
const getGradeAssessmentStats = async (grade) => {
    try {
        const ctx = await getUserSchoolContext();
        if (!ctx)
            return null;
        const base = ctx.organizationId
            ? `users/${ctx.adminId}/organizations/${ctx.organizationId}/schools/${ctx.schoolId}`
            : `users/${ctx.adminId}/schools/${ctx.schoolId}`;
        const studentsRef = (0, firestore_1.collection)(firebase_1.db, `${base}/students`);
        const snap = await (0, firestore_1.getDocs)(studentsRef);
        const targetGrade = normalizeGradeDigits(grade);
        let totalStudents = 0;
        const completed = [];
        snap.forEach((docSnap) => {
            const data = docSnap.data();
            const studentGradeDigits = normalizeGradeDigits(data.grade || data.class);
            if (!studentGradeDigits || studentGradeDigits !== targetGrade)
                return;
            totalStudents++;
            const latest = data.latestAssessment || null;
            if (!latest)
                return;
            const rawRisk = typeof latest.riskPercentage === "number" ? latest.riskPercentage : 0;
            const wellbeingScore = typeof latest.wellbeingScore === "number"
                ? latest.wellbeingScore
                : Math.round(100 - Number(rawRisk || 0));
            let date = new Date();
            const rawDate = latest.assessmentDate || data.lastAssessmentDate;
            if (rawDate === null || rawDate === void 0 ? void 0 : rawDate.toDate) {
                date = rawDate.toDate();
            }
            else if (rawDate instanceof Date) {
                date = rawDate;
            }
            else if (typeof rawDate === "number") {
                date = new Date(rawDate);
            }
            const name = data.name || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Unknown";
            completed.push({
                studentId: docSnap.id,
                name,
                date,
                score: wellbeingScore,
            });
        });
        if (totalStudents === 0) {
            return {
                totalStudents: 0,
                completedStudents: 0,
                avgScore: 0,
                distribution: { excellent: 0, good: 0, average: 0, below50: 0 },
                recentSubmissions: [],
            };
        }
        const completedStudents = completed.length;
        let avgScore = 0;
        if (completedStudents > 0) {
            const totalScore = completed.reduce((sum, c) => sum + (c.score || 0), 0);
            avgScore = Math.round(totalScore / completedStudents);
        }
        const distribution = { excellent: 0, good: 0, average: 0, below50: 0 };
        completed.forEach((c) => {
            if (c.score >= 90)
                distribution.excellent++;
            else if (c.score >= 70)
                distribution.good++;
            else if (c.score >= 50)
                distribution.average++;
            else
                distribution.below50++;
        });
        const recentSubmissions = completed
            .slice()
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 10);
        return {
            totalStudents,
            completedStudents,
            avgScore,
            distribution,
            recentSubmissions,
        };
    }
    catch (e) {
        console.error("[AssessmentManagement] Failed to compute grade stats", e);
        return null;
    }
};
exports.getGradeAssessmentStats = getGradeAssessmentStats;
//# sourceMappingURL=assessmentManagementService.js.map