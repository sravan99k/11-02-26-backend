"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPostAssessmentLogic = exports.getAvailableAssessments = exports.getCurrentPhase = exports.getStudentGrade = void 0;
const firebase_1 = require("@/integrations/firebase");
const firestore_1 = require("firebase/firestore");
const assessmentManifest_json_1 = __importDefault(require("@/components/assessments/assessmentManifest.json"));
const MANIFEST = assessmentManifest_json_1.default;
const getStudentGrade = async (userId) => {
    try {
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.grade) {
                if (typeof data.grade === 'string' && data.grade.toLowerCase().startsWith('grade ')) {
                    return parseInt(data.grade.toLowerCase().replace('grade ', ''));
                }
                return Number(data.grade);
            }
        }
    }
    catch (e) {
        console.error("Error fetching grade:", e);
    }
    return 10;
};
exports.getStudentGrade = getStudentGrade;
const getCurrentPhase = () => {
    const month = new Date().getMonth();
    if (month >= 5 && month <= 6)
        return 1;
    if (month >= 7 && month <= 9)
        return 2;
    if (month >= 10 || month === 0)
        return 3;
    if (month >= 1 && month <= 2)
        return 4;
    return 1;
};
exports.getCurrentPhase = getCurrentPhase;
const getAvailableAssessments = async (userId) => {
    var _a;
    try {
        const grade = await (0, exports.getStudentGrade)(userId);
        const gradeKey = String(grade);
        const allAssessments = MANIFEST.assessments[gradeKey] || [];
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', userId));
        const userData = userDoc.data();
        if (!userData)
            return [];
        const { parentAdminId, schoolId, studentId, organizationId } = userData;
        let assessmentsPath;
        if (organizationId) {
            assessmentsPath = `users/${parentAdminId}/organizations/${organizationId}/schools/${schoolId}/students/${studentId}/assessments`;
        }
        else {
            assessmentsPath = `users/${parentAdminId}/schools/${schoolId}/students/${studentId}/assessments`;
        }
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, assessmentsPath), (0, firestore_1.orderBy)('assessmentDate', 'desc'), (0, firestore_1.limit)(1));
        const snapshot = await (0, firestore_1.getDocs)(q);
        let lastAssessmentDate = null;
        let lastType = null;
        if (!snapshot.empty) {
            const latest = snapshot.docs[0].data();
            lastAssessmentDate = ((_a = latest.assessmentDate) === null || _a === void 0 ? void 0 : _a.toDate()) || new Date(latest.assessmentDate);
            lastType = latest.assessmentType || 'major';
        }
        const result = [];
        const now = new Date();
        for (const asm of allAssessments) {
            let status = 'available';
            let nextAvailableDate = null;
            if (lastAssessmentDate) {
                const diffDays = Math.ceil((now.getTime() - lastAssessmentDate.getTime()) / (1000 * 60 * 60 * 24));
                if (asm.type === 'mini' && lastType === 'major') {
                    if (diffDays < 20) {
                        status = 'locked';
                        nextAvailableDate = new Date(lastAssessmentDate);
                        nextAvailableDate.setDate(nextAvailableDate.getDate() + 20);
                    }
                }
                else if (asm.type === 'mini' && lastType === 'mini') {
                    if (diffDays < 15) {
                        status = 'locked';
                        nextAvailableDate = new Date(lastAssessmentDate);
                        nextAvailableDate.setDate(nextAvailableDate.getDate() + 15);
                    }
                }
            }
            result.push({
                ...asm,
                status,
                month: asm.month,
                dueDate: nextAvailableDate ? nextAvailableDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : undefined
            });
        }
        return result;
    }
    catch (error) {
        console.error("Error getting available assessments:", error);
        return [];
    }
};
exports.getAvailableAssessments = getAvailableAssessments;
const miniAssessmentService_1 = require("./miniAssessmentService");
const processPostAssessmentLogic = async (userId, grade, phase, responses, results) => {
    console.log("Processing post assessment logic", { userId, grade, phase });
    const flags = {};
    let hasSignificantFlag = false;
    Object.entries(results).forEach(([domain, data]) => {
        if (domain === 'overallScore' || domain === 'overall')
            return;
        if (data.score >= 40) {
            flags[domain] = true;
            hasSignificantFlag = true;
        }
    });
    const gradeKey = String(grade);
    const allAssessments = MANIFEST.assessments[gradeKey] || [];
    const phaseMinis = allAssessments.filter((a) => a.phase === phase && a.type === 'mini');
    if (phaseMinis.length > 0) {
        const nextMini = phaseMinis[0];
        await (0, miniAssessmentService_1.scheduleMiniForUser)(userId, {
            grade,
            phase,
            assessmentId: nextMini.id,
            fromAssessmentId: `g${grade}-p${phase}-major`,
            fileKey: nextMini.file,
            flags: flags,
            status: 'scheduled'
        });
        console.log(`[AssessmentLogic] Scheduled ${nextMini.id} for user ${userId} with flags:`, flags);
    }
};
exports.processPostAssessmentLogic = processPostAssessmentLogic;
//# sourceMappingURL=assessmentSchedulerService.js.map