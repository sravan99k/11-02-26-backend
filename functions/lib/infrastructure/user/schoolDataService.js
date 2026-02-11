"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransitionDraft = exports.loadTransitionDraft = exports.saveTransitionDraft = exports.updateAcademicYear = exports.getSchoolSettings = exports.fetchSchoolInfo = exports.fetchSchoolAnalytics = exports.fetchStudents = exports.fetchStudentsPaginated = void 0;
const firebase_1 = require("@/integrations/firebase");
const firestore_1 = require("firebase/firestore");
const fetchStudentsPaginated = async (filters, options = {}) => {
    const { pageSize = 50, lastDoc = null } = options;
    try {
        if (!firebase_1.auth.currentUser) {
            console.error('[SchoolData] No authenticated user');
            return { students: [], lastDoc: null, hasMore: false };
        }
        const userDocRef = (0, firestore_1.doc)(firebase_1.db, 'users', firebase_1.auth.currentUser.uid);
        const userDocSnap = await (0, firestore_1.getDoc)(userDocRef);
        if (!userDocSnap.exists()) {
            console.error('[SchoolData] User document not found');
            return { students: [], lastDoc: null, hasMore: false };
        }
        const userData = userDocSnap.data();
        console.log('[SchoolData] User Data:', userData);
        const adminId = userData.parentAdminId || firebase_1.auth.currentUser.uid;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        console.log('[SchoolData] Path Variables:', { adminId, schoolId, organizationId, isIndependent });
        if (!adminId || !schoolId) {
            console.error('[SchoolData] Missing school information');
            return { students: [], lastDoc: null, hasMore: false };
        }
        const studentsPath = (isIndependent || !organizationId)
            ? `users/${adminId}/schools/${schoolId}/students`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}/students`;
        console.log('[SchoolData] Final Path:', studentsPath);
        let studentsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, studentsPath), (0, firestore_1.orderBy)('name'), (0, firestore_1.limit)(pageSize + 1));
        if (lastDoc) {
            studentsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, studentsPath), (0, firestore_1.orderBy)('name'), (0, firestore_1.startAfter)(lastDoc), (0, firestore_1.limit)(pageSize + 1));
        }
        const studentsSnapshot = await (0, firestore_1.getDocs)(studentsQuery);
        if (studentsSnapshot.empty) {
            console.log('[SchoolData] No students found at:', studentsPath);
            return { students: [], lastDoc: null, hasMore: false };
        }
        const hasMore = studentsSnapshot.docs.length > pageSize;
        const studentDocs = hasMore ? studentsSnapshot.docs.slice(0, pageSize) : studentsSnapshot.docs;
        const newLastDoc = studentDocs.length > 0 ? studentDocs[studentDocs.length - 1] : null;
        const studentsData = await Promise.all(studentDocs.map(async (studentDoc) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const studentData = studentDoc.data();
            if (studentData.latestAssessment) {
                const la = studentData.latestAssessment;
                let lastAssessment = 'No data';
                if (la.assessmentDate) {
                    const date = la.assessmentDate.toDate ? la.assessmentDate.toDate() : new Date(la.assessmentDate);
                    lastAssessment = date.toISOString().split('T')[0];
                }
                return {
                    id: studentDoc.id,
                    name: studentData.name || `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'Unknown',
                    email: studentData.email || studentData.parentEmail || '',
                    phone: studentData.phone || '',
                    gender: studentData.gender || 'Not specified',
                    grade: studentData.grade || 'N/A',
                    section: studentData.section || 'A',
                    risk_level: studentData.riskLevel || (la.riskPercentage >= 70 ? 'high' : la.riskPercentage >= 40 ? 'medium' : 'low'),
                    last_assessment: lastAssessment,
                    wellbeing_score: la.wellbeingScore || Math.round(100 - la.riskPercentage),
                    attendance: studentData.attendance || 90,
                    dateAdded: ((_d = (_c = (_b = (_a = studentData.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.toISOString()) === null || _d === void 0 ? void 0 : _d.split('T')[0]) || new Date().toISOString().split('T')[0],
                    parentName: studentData.parentName || '',
                    parentPhone: studentData.parentPhone || '',
                    interventions: studentData.interventions || [],
                    assessments: []
                };
            }
            const assessmentsPath = `${studentsPath}/${studentDoc.id}/assessments`;
            const assessmentsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, assessmentsPath), (0, firestore_1.orderBy)('assessmentDate', 'desc'), (0, firestore_1.limit)(1));
            let riskLevel = 'low';
            let wellbeingScore = 0;
            let lastAssessment = 'No data';
            try {
                const assessmentsSnapshot = await (0, firestore_1.getDocs)(assessmentsQuery);
                if (!assessmentsSnapshot.empty) {
                    const latestAssessment = assessmentsSnapshot.docs[0].data();
                    const riskPercentage = latestAssessment.riskPercentage || 0;
                    riskLevel = riskPercentage >= 70 ? 'high' : riskPercentage >= 40 ? 'medium' : 'low';
                    wellbeingScore = Math.round(100 - riskPercentage);
                    if (latestAssessment.assessmentDate) {
                        const date = latestAssessment.assessmentDate.toDate();
                        lastAssessment = date.toISOString().split('T')[0];
                    }
                }
            }
            catch (err) {
                console.warn(`[SchoolData] Assessment error for ${studentDoc.id}:`, err);
            }
            return {
                id: studentDoc.id,
                name: studentData.name || `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'Unknown',
                email: studentData.email || studentData.parentEmail || '',
                phone: studentData.phone || '',
                gender: studentData.gender || 'Not specified',
                grade: studentData.grade || 'N/A',
                section: studentData.section || 'A',
                risk_level: riskLevel,
                last_assessment: lastAssessment,
                wellbeing_score: wellbeingScore,
                attendance: studentData.attendance || 90,
                dateAdded: ((_h = (_g = (_f = (_e = studentData.createdAt) === null || _e === void 0 ? void 0 : _e.toDate) === null || _f === void 0 ? void 0 : _f.call(_e)) === null || _g === void 0 ? void 0 : _g.toISOString()) === null || _h === void 0 ? void 0 : _h.split('T')[0]) || new Date().toISOString().split('T')[0],
                parentName: studentData.parentName || '',
                parentPhone: studentData.parentPhone || '',
                interventions: studentData.interventions || [],
                assessments: []
            };
        }));
        console.log(`[SchoolData] Successfully loaded ${studentsData.length} students.`);
        return { students: studentsData, lastDoc: newLastDoc, hasMore };
    }
    catch (error) {
        console.error('[SchoolData] Error fetching students:', error);
        return { students: [], lastDoc: null, hasMore: false };
    }
};
exports.fetchStudentsPaginated = fetchStudentsPaginated;
const fetchStudents = async (filters) => {
    const result = await (0, exports.fetchStudentsPaginated)(filters, { pageSize: 1000 });
    return result.students;
};
exports.fetchStudents = fetchStudents;
const fetchSchoolAnalytics = async (filters) => {
    try {
        const students = await (0, exports.fetchStudents)(filters);
        const riskDistribution = {
            low: students.filter(s => s.risk_level === 'low').length,
            medium: students.filter(s => s.risk_level === 'medium').length,
            high: students.filter(s => s.risk_level === 'high').length
        };
        const activeStudents = students.filter(s => s.last_assessment !== 'No data');
        const wellnessDistribution = {
            thriving: activeStudents.filter(s => s.wellbeing_score >= 80).length,
            stable: activeStudents.filter(s => s.wellbeing_score >= 60 && s.wellbeing_score < 80).length,
            needsSupport: activeStudents.filter(s => s.wellbeing_score >= 40 && s.wellbeing_score < 60).length,
            atRisk: activeStudents.filter(s => s.wellbeing_score < 40).length
        };
        const grades = Array.from(new Set(students.map(s => s.grade))).sort();
        const gradeCompletionData = grades.map(grade => {
            const gradeStudents = students.filter(s => s.grade === grade);
            const completed = gradeStudents.filter(s => s.last_assessment !== 'No data').length;
            return {
                name: `Grade ${grade}`,
                total: gradeStudents.length,
                completed
            };
        });
        const totalAssessments = students.filter(s => s.last_assessment !== 'No data').length;
        const gradeDistribution = {};
        students.forEach(student => {
            const grade = student.grade;
            gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
        });
        const now = Date.now();
        let weightedSum = 0;
        let totalWeight = 0;
        const weightForAgeDays = (ageDays) => {
            if (ageDays <= 7)
                return 1.0;
            if (ageDays <= 30)
                return 0.7;
            if (ageDays <= 90)
                return 0.5;
            return 0.3;
        };
        students.forEach(student => {
            if (student.last_assessment !== 'No data') {
                const assessmentDate = new Date(student.last_assessment);
                const ageDays = Math.max(0, (now - assessmentDate.getTime()) / (1000 * 60 * 60 * 24));
                const weight = weightForAgeDays(ageDays);
                weightedSum += student.wellbeing_score * weight;
                totalWeight += weight;
            }
        });
        const averageWellbeingScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
        const currentMonth = new Date().getMonth();
        const interventionsThisMonth = students.reduce((count, student) => {
            const monthInterventions = student.interventions.filter(int => {
                const intDate = new Date(int.date);
                return intDate.getMonth() === currentMonth;
            });
            return count + monthInterventions.length;
        }, 0);
        const allInterventions = students.flatMap(s => s.interventions);
        const completedInterventions = allInterventions.filter(i => i.status === 'completed').length;
        const interventionSuccessRate = allInterventions.length > 0
            ? Math.round((completedInterventions / allInterventions.length) * 100)
            : 0;
        return {
            totalStudents: students.length,
            highRiskStudents: riskDistribution.high,
            interventionsThisMonth,
            averageWellbeingScore,
            wellbeingTrend: 'stable',
            riskDistribution,
            wellnessDistribution,
            gradeCompletionData,
            totalAssessments,
            interventionSuccessRate,
            gradeDistribution,
            recentAssessments: []
        };
    }
    catch (error) {
        console.error('[SchoolData] Error calculating analytics:', error);
        throw error;
    }
};
exports.fetchSchoolAnalytics = fetchSchoolAnalytics;
const fetchSchoolInfo = async () => {
    try {
        if (!firebase_1.auth.currentUser)
            return null;
        const userDocSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", firebase_1.auth.currentUser.uid));
        if (!userDocSnap.exists())
            return null;
        const userData = userDocSnap.data();
        const adminId = userData.parentAdminId || firebase_1.auth.currentUser.uid;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        if (!adminId || !schoolId)
            return null;
        const schoolPath = (isIndependent || !organizationId)
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const schoolSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, schoolPath));
        if (schoolSnap.exists()) {
            return { id: schoolSnap.id, ...schoolSnap.data() };
        }
        return null;
    }
    catch (error) {
        console.error('[SchoolData] Error fetching school info:', error);
        return null;
    }
};
exports.fetchSchoolInfo = fetchSchoolInfo;
const getSchoolSettings = async () => {
    try {
        if (!firebase_1.auth.currentUser)
            return null;
        const userDocSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", firebase_1.auth.currentUser.uid));
        if (!userDocSnap.exists())
            return null;
        const userData = userDocSnap.data();
        const adminId = userData.parentAdminId || firebase_1.auth.currentUser.uid;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        const schoolPath = (isIndependent || !organizationId)
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const settingsSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, `${schoolPath}/settings`, "academic"));
        if (settingsSnap.exists()) {
            const data = settingsSnap.data();
            return {
                academicYear: data.academicYear || "2025-26",
                term: data.term || "Phase 2"
            };
        }
        return { academicYear: "2025-26", term: "Phase 2" };
    }
    catch (error) {
        console.error('[SchoolData] Error fetching settings:', error);
        return { academicYear: "2025-26" };
    }
};
exports.getSchoolSettings = getSchoolSettings;
const updateAcademicYear = async (newYear, studentUpdates) => {
    const batch = (0, firestore_1.writeBatch)(firebase_1.db);
    try {
        if (!firebase_1.auth.currentUser)
            throw new Error("Not authenticated");
        const userDocSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", firebase_1.auth.currentUser.uid));
        const userData = userDocSnap.data();
        const adminId = userData.parentAdminId || firebase_1.auth.currentUser.uid;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        const schoolPath = (isIndependent || !organizationId)
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const CHUNK_SIZE = 450;
        const promotedCount = studentUpdates.filter(u => u.action === 'promote').length;
        const leftCount = studentUpdates.filter(u => u.action === 'left').length;
        const retainedCount = studentUpdates.filter(u => u.action === 'retain').length;
        for (let i = 0; i < studentUpdates.length; i += CHUNK_SIZE) {
            const chunk = studentUpdates.slice(i, i + CHUNK_SIZE);
            const batch = (0, firestore_1.writeBatch)(firebase_1.db);
            chunk.forEach(update => {
                const studentRef = (0, firestore_1.doc)(firebase_1.db, `${schoolPath}/students`, update.studentId);
                if (update.action === 'promote') {
                    const nextGrade = parseInt(update.currentGrade) + 1;
                    batch.update(studentRef, {
                        grade: String(nextGrade),
                        section: update.newSection || 'A',
                        updatedAt: (0, firestore_1.serverTimestamp)()
                    });
                }
                else if (update.action === 'retain') {
                    batch.update(studentRef, {
                        section: update.newSection || 'A',
                        updatedAt: (0, firestore_1.serverTimestamp)()
                    });
                }
                else if (update.action === 'left') {
                    batch.update(studentRef, {
                        status: 'left',
                        updatedAt: (0, firestore_1.serverTimestamp)()
                    });
                }
            });
            if (i === 0) {
                const settingsRef = (0, firestore_1.doc)(firebase_1.db, `${schoolPath}/settings`, "academic");
                batch.set(settingsRef, { academicYear: newYear }, { merge: true });
            }
            await batch.commit();
        }
        return {
            count: promotedCount,
            leftCount: leftCount,
            retainedCount: retainedCount
        };
    }
    catch (error) {
        console.error('[SchoolData] Error updating academic year:', error);
        throw error;
    }
};
exports.updateAcademicYear = updateAcademicYear;
const saveTransitionDraft = async (draft) => {
    try {
        if (!firebase_1.auth.currentUser)
            throw new Error("Not authenticated");
        const userDocSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", firebase_1.auth.currentUser.uid));
        const userData = userDocSnap.data();
        const adminId = userData.parentAdminId || firebase_1.auth.currentUser.uid;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        const schoolPath = (isIndependent || !organizationId)
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const draftRef = (0, firestore_1.doc)(firebase_1.db, `${schoolPath}/settings`, "academicTransitionDraft");
        await (0, firestore_1.setDoc)(draftRef, { ...draft, lastUpdated: (0, firestore_1.serverTimestamp)() });
        console.log('[SchoolData] Draft saved successfully');
    }
    catch (error) {
        console.error('[SchoolData] Error saving draft:', error);
        throw error;
    }
};
exports.saveTransitionDraft = saveTransitionDraft;
const loadTransitionDraft = async () => {
    try {
        if (!firebase_1.auth.currentUser)
            return null;
        const userDocSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", firebase_1.auth.currentUser.uid));
        if (!userDocSnap.exists())
            return null;
        const userData = userDocSnap.data();
        const adminId = userData.parentAdminId || firebase_1.auth.currentUser.uid;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        const schoolPath = (isIndependent || !organizationId)
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const draftSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, `${schoolPath}/settings`, "academicTransitionDraft"));
        if (draftSnap.exists()) {
            return draftSnap.data();
        }
        return null;
    }
    catch (error) {
        console.error('[SchoolData] Error loading draft:', error);
        return null;
    }
};
exports.loadTransitionDraft = loadTransitionDraft;
const deleteTransitionDraft = async () => {
    try {
        if (!firebase_1.auth.currentUser)
            throw new Error("Not authenticated");
        const userDocSnap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, "users", firebase_1.auth.currentUser.uid));
        const userData = userDocSnap.data();
        const adminId = userData.parentAdminId || firebase_1.auth.currentUser.uid;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        const schoolPath = (isIndependent || !organizationId)
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const draftRef = (0, firestore_1.doc)(firebase_1.db, `${schoolPath}/settings`, "academicTransitionDraft");
        await (0, firestore_1.deleteDoc)(draftRef);
        console.log('[SchoolData] Draft deleted successfully');
    }
    catch (error) {
        console.error('[SchoolData] Error deleting draft:', error);
        throw error;
    }
};
exports.deleteTransitionDraft = deleteTransitionDraft;
//# sourceMappingURL=schoolDataService.js.map