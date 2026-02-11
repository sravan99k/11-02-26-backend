"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentAssessmentProgress = exports.getAvailableAssessmentsForStudent = void 0;
const firebase_1 = require("@/integrations/firebase");
const firestore_1 = require("firebase/firestore");
const assessmentManagementService_1 = require("./assessmentManagementService");
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
    const organizationId = data.organizationId || null;
    const isIndependent = data.isIndependent;
    if (!adminId || !schoolId)
        return null;
    return { adminId, schoolId, organizationId, isIndependent };
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
const getStudentDocPath = async () => {
    var _a;
    const ctx = await getUserSchoolContext();
    if (!ctx)
        return null;
    const base = ctx.organizationId
        ? `users/${ctx.adminId}/organizations/${ctx.organizationId}/schools/${ctx.schoolId}`
        : `users/${ctx.adminId}/schools/${ctx.schoolId}`;
    return `${base}/students/${(_a = firebase_1.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid}`;
};
const getStudentProgress = async () => {
    try {
        const studentPath = await getStudentDocPath();
        if (!studentPath)
            return {};
        const studentRef = (0, firestore_1.doc)(firebase_1.db, studentPath);
        const snap = await (0, firestore_1.getDoc)(studentRef);
        if (!snap.exists())
            return {};
        const data = snap.data();
        const assessmentProgress = data.assessmentProgress || {};
        return assessmentProgress;
    }
    catch (e) {
        console.error("[StudentAssessment] Failed to get student progress", e);
        return {};
    }
};
const getAssessmentSequence = (gradeData) => {
    return gradeData.phases.flatMap((phase) => phase.assessments.map((assessment) => ({
        ...assessment,
        phaseName: phase.name,
        phaseColor: phase.color,
        phasePeriod: phase.period
    })));
};
const isAssessmentAvailableForStudent = (assessmentId, enabledAssessments, gradeData, studentProgress) => {
    if (!enabledAssessments[assessmentId]) {
        return { isAvailable: false, blockedBy: "Not enabled by administrator" };
    }
    const sequence = getAssessmentSequence(gradeData);
    const currentIndex = sequence.findIndex(a => a.id === assessmentId);
    if (currentIndex === -1)
        return { isAvailable: false };
    if (currentIndex === 0)
        return { isAvailable: true };
    const previousAssessment = sequence[currentIndex - 1];
    const previousProgress = studentProgress[previousAssessment.id];
    if (!previousProgress || !previousProgress.isCompleted) {
        return {
            isAvailable: false,
            blockedBy: `Complete "${previousAssessment.name}" first`
        };
    }
    return { isAvailable: true };
};
const getAvailableAssessmentsForStudent = async (grade) => {
    try {
        const enabledAssessments = await (0, assessmentManagementService_1.loadEnabledAssessments)();
        const studentProgress = await getStudentProgress();
        const gradeData = {
            phases: [
                {
                    name: "The Transition",
                    period: "June - August",
                    color: "blue",
                    assessments: [
                        {
                            id: "g6-p1-baseline",
                            name: "The Baseline",
                            type: "Major",
                            questions: 20,
                            sections: [
                                { id: "baseline-demographics", name: "Student Background", questions: 5, required: true },
                                { id: "baseline-academic", name: "Academic Stress", questions: 8, required: true },
                                { id: "baseline-social", name: "Social Adjustment", questions: 7, required: true }
                            ]
                        },
                        {
                            id: "g6-p1-adjustment",
                            name: "Adjustment Check",
                            type: "Mini",
                            questions: 4,
                            sections: [
                                { id: "adjustment-routine", name: "Daily Routine", questions: 2, required: true },
                                { id: "adjustment-friends", name: "Friend Circle", questions: 2, required: true }
                            ]
                        }
                    ]
                }
            ]
        };
        const sequence = getAssessmentSequence(gradeData);
        const availableAssessments = [];
        sequence.forEach(assessment => {
            var _a, _b;
            const availability = isAssessmentAvailableForStudent(assessment.id, enabledAssessments, gradeData, studentProgress);
            const progress = studentProgress[assessment.id];
            const completedSections = ((_a = progress === null || progress === void 0 ? void 0 : progress.completedSections) === null || _a === void 0 ? void 0 : _a.length) || 0;
            const totalSections = ((_b = assessment.sections) === null || _b === void 0 ? void 0 : _b.length) || 1;
            const progressPercentage = (completedSections / totalSections) * 100;
            availableAssessments.push({
                id: assessment.id,
                name: assessment.name,
                type: assessment.type,
                questions: assessment.questions,
                sections: assessment.sections,
                phaseName: assessment.phaseName,
                phasePeriod: assessment.phasePeriod,
                isAvailable: availability.isAvailable,
                isCompleted: (progress === null || progress === void 0 ? void 0 : progress.isCompleted) || false,
                progress: progressPercentage,
                blockedBy: availability.blockedBy
            });
        });
        return availableAssessments;
    }
    catch (e) {
        console.error("[StudentAssessment] Failed to get available assessments", e);
        return [];
    }
};
exports.getAvailableAssessmentsForStudent = getAvailableAssessmentsForStudent;
const updateStudentAssessmentProgress = async (assessmentId, sectionId, isCompleted = false) => {
    try {
        const studentPath = await getStudentDocPath();
        if (!studentPath)
            return;
        const studentRef = (0, firestore_1.doc)(firebase_1.db, studentPath);
        const snap = await (0, firestore_1.getDoc)(studentRef);
        let currentProgress = {};
        if (snap.exists()) {
            const data = snap.data();
            currentProgress = data.assessmentProgress || {};
        }
        if (!currentProgress[assessmentId]) {
            const assessment = (0, exports.getAvailableAssessmentsForStudent)(6).then(assessments => assessments.find(a => a.id === assessmentId));
            currentProgress[assessmentId] = {
                assessmentId,
                completedSections: [],
                totalSections: 3,
                isCompleted: false
            };
        }
        const assessmentProgress = currentProgress[assessmentId];
        if (isCompleted && !assessmentProgress.completedSections.includes(sectionId)) {
            assessmentProgress.completedSections.push(sectionId);
        }
        const assessment = await (0, exports.getAvailableAssessmentsForStudent)(6).then(assessments => assessments.find(a => a.id === assessmentId));
        if (assessment && assessment.sections) {
            assessmentProgress.totalSections = assessment.sections.length;
            assessmentProgress.isCompleted = assessmentProgress.completedSections.length === assessment.sections.length;
            if (assessmentProgress.isCompleted) {
                assessmentProgress.completedAt = new Date();
            }
        }
        await (0, firestore_1.setDoc)(studentRef, {
            assessmentProgress: currentProgress,
            lastAssessmentDate: new Date()
        }, { merge: true });
    }
    catch (e) {
        console.error("[StudentAssessment] Failed to update progress", e);
    }
};
exports.updateStudentAssessmentProgress = updateStudentAssessmentProgress;
//# sourceMappingURL=studentAssessmentService.js.map