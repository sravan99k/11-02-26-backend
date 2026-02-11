"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStudentNote = exports.resolveChatTrigger = exports.subscribeToTeacherSessions = exports.subscribeToTeacherActivities = exports.subscribeToChatTriggers = exports.subscribeToTeacherAssessments = exports.calculateAnalyticsFromStudents = exports.subscribeToTeacherStudents = exports.getRecentActivityStudents = exports.getClassStatistics = exports.getStudentsByRiskLevel = exports.fetchTeacherStudents = exports.fetchTeacherAnalytics = void 0;
const firebase_1 = require("@/integrations/firebase");
const generatePrivacySafeMessage = (trigger) => {
    var _a, _b;
    const { category = 'general', subcategory = 'general', severity = 'monitor' } = trigger;
    const messages = {
        'academic': {
            'exam-stress': 'Expressed significant stress about upcoming assessments',
            'homework-overload': 'Indicated feeling overwhelmed by academic workload',
            'subject-difficulty': 'Reported challenges with specific subject matter',
            'performance-anxiety': 'Showed signs of anxiety related to academic performance',
            'learning-gap': 'May be experiencing gaps in foundational knowledge',
            'general': 'Academic concern detected that may need attention'
        },
        'emotional': {
            'anxiety': 'Displayed signs of anxiety that may need attention',
            'depression': 'Showed indicators of low mood or depression',
            'stress': 'Experiencing high levels of stress',
            'self-esteem': 'Expressed concerns about self-worth or confidence',
            'emotional-regulation': 'May need support with emotional regulation',
            'general': 'Emotional concern detected that may need attention'
        },
        'social': {
            'bullying': 'May be experiencing or witnessing bullying behavior',
            'conflict': 'Involved in or affected by peer conflict',
            'isolation': 'Showing signs of social withdrawal or isolation',
            'friendship-issues': 'Experiencing difficulties in peer relationships',
            'peer-pressure': 'May be facing challenging peer dynamics',
            'general': 'Social concern detected that may need attention'
        },
        'safety': {
            'self-harm': 'Expressed thoughts of self-harm or suicidal ideation',
            'abuse': 'May be experiencing or at risk of abuse',
            'violence': 'Exposed to or at risk of violence',
            'substance-use': 'Potential substance use concerns',
            'self-neglect': 'Showing signs of self-neglect or risky behavior',
            'general': 'Safety concern detected that requires immediate attention'
        },
        'behavioral': {
            'disruptive': 'Displaying disruptive classroom behavior',
            'withdrawn': 'Showing withdrawal from participation',
            'defiant': 'Demonstrating oppositional or defiant behavior',
            'impulsive': 'Exhibiting impulsive or hyperactive tendencies',
            'disengaged': 'Appears disengaged from learning activities',
            'general': 'Behavioral concern detected that may need attention'
        },
        'general': {
            'general': 'Concern detected that may need attention'
        }
    };
    return ((_a = messages[category]) === null || _a === void 0 ? void 0 : _a[subcategory]) ||
        ((_b = messages[category]) === null || _b === void 0 ? void 0 : _b.general) ||
        messages.general.general;
};
const firestore_1 = require("firebase/firestore");
const fetchTeacherAnalytics = async (classes) => {
    try {
        return {
            totalStudents: 0,
            averageWellbeing: 0,
            engagementRate: 0,
            participationRate: 0,
            performanceData: []
        };
    }
    catch (error) {
        console.error('[TeacherData] Error fetching analytics:', error);
        throw error;
    }
};
exports.fetchTeacherAnalytics = fetchTeacherAnalytics;
const fetchTeacherStudents = async (classes) => {
    try {
        if (!firebase_1.auth.currentUser) {
            console.log('[TeacherData] No authenticated user');
            return [];
        }
        const userDocRef = (0, firestore_1.doc)(firebase_1.db, 'users', firebase_1.auth.currentUser.uid);
        const userDocSnap = await (0, firestore_1.getDoc)(userDocRef);
        if (!userDocSnap.exists()) {
            console.error('[TeacherData] User document not found');
            return [];
        }
        const userData = userDocSnap.data();
        const teacherId = userData.teacherId;
        const schoolId = userData.schoolId;
        const adminId = userData.parentAdminId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        if (!teacherId || !schoolId || !adminId) {
            console.error('[TeacherData] Missing teacher/school/admin ID');
            return [];
        }
        let schoolPath = '';
        if (isIndependent) {
            schoolPath = `users/${adminId}/schools/${schoolId}`;
        }
        else {
            schoolPath = `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        }
        const assignmentsPath = `${schoolPath}/assignments/_list/teachers/${teacherId}/students`;
        console.log('[TeacherData] Fetching assignments from:', assignmentsPath);
        const assignmentsSnapshot = await (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, assignmentsPath));
        const studentIds = assignmentsSnapshot.docs.map(doc => doc.id);
        if (studentIds.length === 0) {
            console.log('[TeacherData] No students assigned to this teacher');
            return [];
        }
        const studentsPath = `${schoolPath}/students`;
        console.log('[TeacherData] Fetching student data from:', studentsPath);
        const studentsData = [];
        for (const studentId of studentIds) {
            const studentDocRef = (0, firestore_1.doc)(firebase_1.db, studentsPath, studentId);
            const studentDocSnap = await (0, firestore_1.getDoc)(studentDocRef);
            if (studentDocSnap.exists()) {
                const data = studentDocSnap.data();
                studentsData.push({
                    uid: studentDocSnap.id,
                    name: data.name || `${data.firstName} ${data.lastName}`,
                    class: data.grade || 'N/A',
                    riskLevel: data.riskLevel || 'low',
                    wellbeingScore: data.wellbeingScore || 0,
                    engagementRate: data.engagementRate || 80,
                    lastActivity: data.lastActivity || new Date().toISOString().split('T')[0],
                    fullProfile: {
                        grade: data.grade || 'N/A',
                        age: data.age || 0,
                        parentContact: data.parentPhone || '',
                        parentEmail: data.parentEmail || '',
                        emergencyContact: data.parentPhone || '',
                        address: data.address || '',
                        medicalInfo: data.medicalInfo || 'None'
                    }
                });
            }
        }
        console.log('[TeacherData] Loaded students:', studentsData.length);
        return studentsData;
    }
    catch (error) {
        console.error('[TeacherData] Error fetching students:', error);
        return [];
    }
};
exports.fetchTeacherStudents = fetchTeacherStudents;
const getStudentsByRiskLevel = (students, riskLevel) => {
    return students.filter(student => student.riskLevel === riskLevel);
};
exports.getStudentsByRiskLevel = getStudentsByRiskLevel;
const getClassStatistics = (students, className) => {
    const classStudents = students.filter(student => student.class === className);
    const averageWellbeing = classStudents.reduce((sum, student) => sum + student.wellbeingScore, 0) / classStudents.length;
    return {
        totalStudents: classStudents.length,
        averageWellbeing: Math.round(averageWellbeing),
        riskDistribution: {
            low: classStudents.filter(s => s.riskLevel === 'low').length,
            medium: classStudents.filter(s => s.riskLevel === 'medium').length,
            high: classStudents.filter(s => s.riskLevel === 'high').length,
        }
    };
};
exports.getClassStatistics = getClassStatistics;
const getRecentActivityStudents = (students, days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return students.filter(student => {
        const lastActivity = new Date(student.lastActivity);
        return lastActivity >= cutoffDate;
    });
};
exports.getRecentActivityStudents = getRecentActivityStudents;
const subscribeToTeacherStudents = async (callback) => {
    try {
        if (!firebase_1.auth.currentUser) {
            console.log('[TeacherData] No authenticated user');
            return null;
        }
        const userDocRef = (0, firestore_1.doc)(firebase_1.db, 'users', firebase_1.auth.currentUser.uid);
        const userDocSnap = await (0, firestore_1.getDoc)(userDocRef);
        if (!userDocSnap.exists()) {
            console.error('[TeacherData] User document not found');
            return null;
        }
        const userData = userDocSnap.data();
        const teacherId = userData.teacherId;
        const schoolId = userData.schoolId;
        const adminId = userData.parentAdminId;
        const organizationId = userData.organizationId;
        const isIndependent = userData.isIndependent;
        if (!teacherId || !schoolId || !adminId) {
            console.error('[TeacherData] Missing teacher/school/admin ID');
            return null;
        }
        let schoolPath = '';
        if (isIndependent) {
            schoolPath = `users/${adminId}/schools/${schoolId}`;
        }
        else {
            schoolPath = `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        }
        const assignmentsPath = `${schoolPath}/assignments/_list/teachers/${teacherId}/students`;
        const assignmentsSnapshot = await (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, assignmentsPath));
        const studentIds = assignmentsSnapshot.docs.map(doc => doc.id);
        if (studentIds.length === 0) {
            console.log('[TeacherData] No students assigned to this teacher');
            callback([]);
            return () => { };
        }
        const unsubscribers = [];
        const studentsMap = new Map();
        const updateCallback = () => {
            callback(Array.from(studentsMap.values()));
        };
        for (const studentId of studentIds) {
            const studentDocRef = (0, firestore_1.doc)(firebase_1.db, `${schoolPath}/students`, studentId);
            const unsubStudent = (0, firestore_1.onSnapshot)(studentDocRef, async (studentDoc) => {
                if (studentDoc.exists()) {
                    const data = studentDoc.data();
                    const assessmentsPath = `${schoolPath}/students/${studentId}/assessments`;
                    const assessmentsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, assessmentsPath), (0, firestore_1.orderBy)('assessmentDate', 'desc'));
                    const unsubAssessments = (0, firestore_1.onSnapshot)(assessmentsQuery, (assessmentsSnap) => {
                        let riskLevel = 'low';
                        let wellbeingScore = 0;
                        let lastActivity = new Date().toISOString().split('T')[0];
                        let reason = '';
                        let assessments = [];
                        console.log(`[TeacherData] Assessments for ${studentId}:`, assessmentsSnap.size, 'found');
                        if (!assessmentsSnap.empty) {
                            const latestAssessment = assessmentsSnap.docs[0].data();
                            const riskPercentage = latestAssessment.riskPercentage || 0;
                            const riskCategory = typeof latestAssessment.riskCategory === 'object'
                                ? (latestAssessment.riskCategory.label || 'Low Risk')
                                : (latestAssessment.riskCategory || 'Low Risk');
                            console.log(`[TeacherData] Latest assessment for ${studentId}:`, {
                                riskPercentage,
                                riskCategory,
                                assessmentDate: latestAssessment.assessmentDate
                            });
                            wellbeingScore = Math.round(100 - riskPercentage);
                            if (riskCategory === 'High Risk' || riskPercentage >= 70) {
                                riskLevel = 'high';
                                reason = 'High risk assessment score';
                            }
                            else if (riskCategory === 'Moderate Risk' || riskPercentage >= 40) {
                                riskLevel = 'medium';
                                reason = 'Moderate risk indicators';
                            }
                            else {
                                riskLevel = 'low';
                            }
                            if (latestAssessment.assessmentDate) {
                                const assessmentDate = latestAssessment.assessmentDate.toDate();
                                lastActivity = assessmentDate.toISOString().split('T')[0];
                            }
                            assessments = assessmentsSnap.docs.map(docSnap => {
                                const aData = docSnap.data();
                                const aRiskPercentage = aData.riskPercentage || 0;
                                const aWellbeingScore = Math.round(100 - aRiskPercentage);
                                let dateMs = Date.now();
                                const rawDate = aData.assessmentDate;
                                if (rawDate === null || rawDate === void 0 ? void 0 : rawDate.toDate) {
                                    dateMs = rawDate.toDate().getTime();
                                }
                                else if (rawDate instanceof Date) {
                                    dateMs = rawDate.getTime();
                                }
                                else if (typeof rawDate === 'number') {
                                    dateMs = rawDate;
                                }
                                return {
                                    date: dateMs,
                                    wellbeingScore: aWellbeingScore,
                                    domainScores: aData.domainScores || {}
                                };
                            });
                        }
                        studentsMap.set(studentId, {
                            uid: studentId,
                            name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown',
                            class: data.grade || data.class || 'N/A',
                            riskLevel,
                            wellbeingScore,
                            engagementRate: data.engagementRate || 80,
                            lastActivity,
                            reason,
                            fullProfile: {
                                grade: data.grade || 'N/A',
                                age: data.age || 0,
                                parentContact: data.parentPhone || '',
                                parentEmail: data.parentEmail || '',
                                emergencyContact: data.parentPhone || '',
                                address: data.address || '',
                                medicalInfo: data.medicalInfo || 'None'
                            },
                            assessments
                        });
                        updateCallback();
                    }, (error) => {
                        console.error(`[TeacherData] Error listening to assessments for ${studentId}:`, error);
                        console.error('[TeacherData] This might be a missing Firebase index. Check Firebase console.');
                        studentsMap.set(studentId, {
                            uid: studentId,
                            name: data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown',
                            class: data.grade || data.class || 'N/A',
                            riskLevel: 'low',
                            wellbeingScore: 0,
                            engagementRate: data.engagementRate || 80,
                            lastActivity: new Date().toISOString().split('T')[0],
                            reason: '',
                            fullProfile: {
                                grade: data.grade || 'N/A',
                                age: data.age || 0,
                                parentContact: data.parentPhone || '',
                                parentEmail: data.parentEmail || '',
                                emergencyContact: data.parentPhone || '',
                                address: data.address || '',
                                medicalInfo: data.medicalInfo || 'None'
                            }
                        });
                        updateCallback();
                    });
                    unsubscribers.push(unsubAssessments);
                }
            });
            unsubscribers.push(unsubStudent);
        }
        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }
    catch (error) {
        console.error('[TeacherData] Error setting up real-time listener:', error);
        return null;
    }
};
exports.subscribeToTeacherStudents = subscribeToTeacherStudents;
const calculateAnalyticsFromStudents = (students) => {
    if (students.length === 0) {
        return {
            totalStudents: 0,
            averageWellbeing: 0,
            engagementRate: 0,
            participationRate: 0,
            performanceData: []
        };
    }
    const studentsWithWellbeing = students.filter(s => s.wellbeingScore > 0);
    const averageWellbeing = studentsWithWellbeing.length > 0
        ? Math.round(studentsWithWellbeing.reduce((sum, s) => sum + s.wellbeingScore, 0) / studentsWithWellbeing.length)
        : 0;
    const totalEngagement = students.reduce((sum, s) => sum + s.engagementRate, 0);
    const averageEngagement = students.length > 0
        ? Math.round(totalEngagement / students.length)
        : 0;
    const performanceData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    for (let i = 2; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        performanceData.push({
            month: months[monthIndex],
            wellbeingScore: averageWellbeing,
            engagementScore: averageEngagement
        });
    }
    return {
        totalStudents: students.length,
        averageWellbeing,
        engagementRate: averageEngagement,
        participationRate: Math.round(averageEngagement * 0.9),
        performanceData
    };
};
exports.calculateAnalyticsFromStudents = calculateAnalyticsFromStudents;
const subscribeToTeacherAssessments = async (callback) => {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user) {
            console.error('[TeacherAssessments] No authenticated user');
            return null;
        }
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
        if (!userDoc.exists()) {
            console.error('[TeacherAssessments] User document not found');
            return null;
        }
        const userData = userDoc.data();
        const adminId = userData.parentAdminId;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        if (!adminId || !schoolId) {
            console.error('[TeacherAssessments] Missing school information');
            return null;
        }
        const isIndependent = !organizationId;
        const schoolPath = isIndependent
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        console.log('[TeacherAssessments] Setting up listener at:', schoolPath);
        const assignmentsPath = `${schoolPath}/assessment_assignments`;
        const assignmentsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, assignmentsPath), (0, firestore_1.orderBy)('createdDate', 'desc'));
        const unsubscribe = (0, firestore_1.onSnapshot)(assignmentsQuery, async (snapshot) => {
            console.log('[TeacherAssessments] Received', snapshot.size, 'assignments');
            if (snapshot.empty) {
                callback([]);
                return;
            }
            const assessments = [];
            for (const docSnap of snapshot.docs) {
                const data = docSnap.data();
                const assignedStudentIds = data.assignedStudents || [];
                let completedCount = 0;
                for (const studentId of assignedStudentIds) {
                    try {
                        const studentAssessmentsPath = `${schoolPath}/students/${studentId}/assessments`;
                        const studentAssessmentsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, studentAssessmentsPath), (0, firestore_1.orderBy)('assessmentDate', 'desc'));
                        const studentAssessments = await (0, firestore_1.getDocs)(studentAssessmentsQuery);
                        if (!studentAssessments.empty) {
                            const startDate = data.startDate ? new Date(data.startDate) : null;
                            const endDate = data.endDate ? new Date(data.endDate) : null;
                            const hasCompletedInRange = studentAssessments.docs.some(doc => {
                                var _a;
                                const assessmentData = doc.data();
                                const assessmentDate = (_a = assessmentData.assessmentDate) === null || _a === void 0 ? void 0 : _a.toDate();
                                if (!assessmentDate)
                                    return false;
                                if (startDate && assessmentDate < startDate)
                                    return false;
                                if (endDate && assessmentDate > endDate)
                                    return false;
                                return true;
                            });
                            if (hasCompletedInRange) {
                                completedCount++;
                            }
                        }
                    }
                    catch (error) {
                        console.error(`[TeacherAssessments] Error checking student ${studentId}:`, error);
                    }
                }
                assessments.push({
                    id: docSnap.id,
                    title: data.title || 'Untitled Assessment',
                    type: data.type || 'wellbeing',
                    status: data.status || 'draft',
                    studentsAssigned: assignedStudentIds.length,
                    studentsCompleted: completedCount,
                    createdDate: data.createdDate || new Date().toISOString().split('T')[0],
                    startDate: data.startDate || '',
                    endDate: data.endDate || '',
                    description: data.description || '',
                    priority: data.priority,
                    assignedStudents: assignedStudentIds,
                    createdBy: data.createdBy
                });
            }
            callback(assessments);
        });
        return unsubscribe;
    }
    catch (error) {
        console.error('[TeacherAssessments] Error setting up listener:', error);
        return null;
    }
};
exports.subscribeToTeacherAssessments = subscribeToTeacherAssessments;
const subscribeToChatTriggers = async (callback) => {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user) {
            console.error('[ChatTriggers] No authenticated user');
            return null;
        }
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
        if (!userDoc.exists()) {
            console.error('[ChatTriggers] User document not found');
            return null;
        }
        const userData = userDoc.data();
        const teacherId = userData.teacherId;
        const adminId = userData.parentAdminId;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        if (!teacherId || !schoolId || !adminId) {
            console.error('[ChatTriggers] Missing teacher/school information');
            return null;
        }
        const isIndependent = !organizationId;
        const schoolPath = isIndependent
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const assignmentsPath = `${schoolPath}/assignments/_list/teachers/${teacherId}/students`;
        const assignmentsSnapshot = await (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, assignmentsPath));
        const studentIds = assignmentsSnapshot.docs.map(doc => doc.id);
        if (studentIds.length === 0) {
            console.log('[ChatTriggers] No students assigned to this teacher');
            callback([]);
            return () => { };
        }
        console.log('[ChatTriggers] Monitoring triggers for', studentIds.length, 'students');
        const unsubscribers = [];
        const triggersMap = new Map();
        const updateCallback = () => {
            const sortedTriggers = Array.from(triggersMap.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            callback(sortedTriggers);
        };
        for (const studentId of studentIds) {
            const triggersPath = `${schoolPath}/students/${studentId}/chatTriggers`;
            const triggersQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, triggersPath), (0, firestore_1.orderBy)('timestamp', 'desc'));
            const unsubTriggers = (0, firestore_1.onSnapshot)(triggersQuery, (snapshot) => {
                snapshot.docChanges().forEach(change => {
                    var _a, _b, _c, _d;
                    const data = change.doc.data();
                    const triggerId = change.doc.id;
                    if (change.type === 'added' || change.type === 'modified') {
                        let timestamp;
                        if ((_a = data.timestamp) === null || _a === void 0 ? void 0 : _a.toDate) {
                            timestamp = data.timestamp.toDate();
                        }
                        else if (data.timestamp instanceof Date) {
                            timestamp = data.timestamp;
                        }
                        else if (typeof data.timestamp === 'number') {
                            timestamp = new Date(data.timestamp);
                        }
                        else {
                            timestamp = new Date();
                        }
                        const privacySafeMessage = generatePrivacySafeMessage({
                            category: data.category,
                            subcategory: data.subcategory || 'general',
                            severity: data.severity
                        });
                        triggersMap.set(triggerId, {
                            id: triggerId,
                            studentId: data.studentId,
                            studentName: data.studentName,
                            message: data.message,
                            privacySafeMessage: data.privacySafeMessage || privacySafeMessage,
                            severity: data.severity || 'monitor',
                            category: data.category || 'general',
                            subcategory: data.subcategory || 'general',
                            reason: data.reason || 'Pattern detected in student interactions',
                            timestamp: timestamp,
                            schoolId: data.schoolId,
                            organizationId: data.organizationId,
                            indicators: data.indicators || [
                                `Category: ${data.category || 'general'}`,
                                data.severity ? `Severity: ${data.severity}` : null,
                                data.subcategory ? `Subcategory: ${data.subcategory}` : null
                            ].filter(Boolean),
                            recommendedActions: data.recommendedActions || [
                                'Check in with the student privately',
                                'Document the concern in the student record',
                                'Consider referring to school counselor if concerns persist'
                            ],
                            engagementMetrics: data.engagementMetrics || {
                                interactionCount: data.interactionCount || 1,
                                trend: data.trend || 'stable',
                                peakTimes: data.peakTimes || []
                            },
                            status: data.status || 'new',
                            lastUpdated: new Date(),
                            metadata: {
                                isAnonymous: ((_b = data.metadata) === null || _b === void 0 ? void 0 : _b.isAnonymous) || false,
                                requiresFollowUp: ((_c = data.metadata) === null || _c === void 0 ? void 0 : _c.requiresFollowUp) || false,
                                confidenceScore: ((_d = data.metadata) === null || _d === void 0 ? void 0 : _d.confidenceScore) || 0.8
                            }
                        });
                    }
                    else if (change.type === 'removed') {
                        triggersMap.delete(triggerId);
                    }
                });
                updateCallback();
            }, (error) => {
                console.error(`[ChatTriggers] Error listening to triggers for ${studentId}:`, error);
            });
            unsubscribers.push(unsubTriggers);
        }
        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }
    catch (error) {
        console.error('[ChatTriggers] Error setting up listener:', error);
        return null;
    }
};
exports.subscribeToChatTriggers = subscribeToChatTriggers;
const subscribeToTeacherActivities = async (callback) => {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user)
            return null;
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
        if (!userDoc.exists())
            return null;
        const userData = userDoc.data();
        const adminId = userData.parentAdminId;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const teacherId = userData.teacherId;
        if (!adminId || !schoolId || !teacherId)
            return null;
        const schoolPath = !organizationId
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const activitiesPath = `${schoolPath}/teachers/${teacherId}/activities`;
        const activitiesQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, activitiesPath), (0, firestore_1.orderBy)('scheduledDate', 'desc'));
        return (0, firestore_1.onSnapshot)(activitiesQuery, (snapshot) => {
            const activities = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(activities);
        });
    }
    catch (error) {
        console.error('[TeacherActivities] Error:', error);
        return null;
    }
};
exports.subscribeToTeacherActivities = subscribeToTeacherActivities;
const subscribeToTeacherSessions = async (callback) => {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user)
            return null;
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
        if (!userDoc.exists())
            return null;
        const userData = userDoc.data();
        const adminId = userData.parentAdminId;
        const schoolId = userData.schoolId;
        const organizationId = userData.organizationId;
        const teacherId = userData.teacherId;
        if (!adminId || !schoolId || !teacherId)
            return null;
        const schoolPath = !organizationId
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const sessionsPath = `${schoolPath}/teachers/${teacherId}/sessions`;
        const sessionsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, sessionsPath), (0, firestore_1.orderBy)('scheduledDate', 'desc'));
        return (0, firestore_1.onSnapshot)(sessionsQuery, (snapshot) => {
            const sessions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(sessions);
        });
    }
    catch (error) {
        console.error('[TeacherSessions] Error:', error);
        return null;
    }
};
exports.subscribeToTeacherSessions = subscribeToTeacherSessions;
const resolveChatTrigger = async (studentId, triggerId, note, status = 'resolved') => {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user)
            return;
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
        const userData = userDoc.data();
        if (!userData)
            return;
        const { schoolId, parentAdminId: adminId, organizationId } = userData;
        const schoolPath = !organizationId
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const triggerRef = (0, firestore_1.doc)(firebase_1.db, `${schoolPath}/students/${studentId}/chatTriggers`, triggerId);
        await (0, firestore_2.setDoc)(triggerRef, {
            status,
            resolutionNote: note,
            resolvedBy: user.email,
            lastUpdated: (0, firestore_2.serverTimestamp)()
        }, { merge: true });
        const studentDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, `${schoolPath}/students`, studentId));
        const studentData = studentDoc.data();
        await (0, exports.addStudentNote)(studentId, {
            content: note,
            category: 'Intervention',
            author: user.email || 'Teacher',
            type: 'observation',
            phaseId: (studentData === null || studentData === void 0 ? void 0 : studentData.currentPhaseId) || 1
        });
    }
    catch (error) {
        console.error('[ChatTriggers] Error resolving trigger:', error);
        throw error;
    }
};
exports.resolveChatTrigger = resolveChatTrigger;
const addStudentNote = async (studentId, note) => {
    try {
        const user = firebase_1.auth.currentUser;
        if (!user)
            return;
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', user.uid));
        const userData = userDoc.data();
        if (!userData)
            return;
        const { schoolId, parentAdminId: adminId, organizationId } = userData;
        const schoolPath = !organizationId
            ? `users/${adminId}/schools/${schoolId}`
            : `users/${adminId}/organizations/${organizationId}/schools/${schoolId}`;
        const notesCollection = (0, firestore_1.collection)(firebase_1.db, `${schoolPath}/students/${studentId}/notes`);
        await (0, firestore_2.setDoc)((0, firestore_1.doc)(notesCollection), {
            ...note,
            timestamp: (0, firestore_2.serverTimestamp)(),
        });
    }
    catch (error) {
        console.error('[StudentNotes] Error adding note:', error);
        throw error;
    }
};
exports.addStudentNote = addStudentNote;
const firestore_2 = require("firebase/firestore");
//# sourceMappingURL=teacherDataService.js.map