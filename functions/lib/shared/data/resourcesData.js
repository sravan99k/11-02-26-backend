"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveStudyPlan = saveStudyPlan;
exports.logSleep = logSleep;
exports.getSleepLogs = getSleepLogs;
exports.deleteSleepLog = deleteSleepLog;
exports.getSleepRelaxationStats = getSleepRelaxationStats;
exports.logSelfTalk = logSelfTalk;
exports.logGratitude = logGratitude;
exports.logReframe = logReframe;
exports.getHealthyMindStats = getHealthyMindStats;
exports.getStudyPlans = getStudyPlans;
exports.deleteStudyPlan = deleteStudyPlan;
exports.saveFocusStudyPlan = saveFocusStudyPlan;
exports.getFocusStudyPlans = getFocusStudyPlans;
exports.deleteFocusStudyPlan = deleteFocusStudyPlan;
exports.saveSupportCircle = saveSupportCircle;
exports.getSupportCircles = getSupportCircles;
exports.deleteSupportCircle = deleteSupportCircle;
exports.awardBadge = awardBadge;
exports.hasBadge = hasBadge;
exports.listBadges = listBadges;
exports.deleteBadge = deleteBadge;
exports.logGrowthJournal = logGrowthJournal;
exports.getGrowthMindsetStats = getGrowthMindsetStats;
exports.getGrowthJournalEntries = getGrowthJournalEntries;
exports.deleteGrowthJournalEntry = deleteGrowthJournalEntry;
exports.logExercise = logExercise;
exports.getExerciseLogs = getExerciseLogs;
exports.deleteExerciseLog = deleteExerciseLog;
exports.logHydration = logHydration;
exports.getHydrationStatus = getHydrationStatus;
exports.getStressManagementStats = getStressManagementStats;
const firebase_1 = require("../integrations/firebase");
const firestore_1 = require("firebase/firestore");
async function getStudentPathInfo(userId) {
    const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', userId));
    const userData = userDoc.data();
    if (!userData) {
        throw new Error('User data not found');
    }
    const studentId = userData.studentId;
    const adminId = userData.parentAdminId || userData.adminId;
    const schoolId = userData.schoolId;
    const organizationId = userData.organizationId || null;
    if (!studentId) {
        throw new Error('Missing studentId in users/{uid} document');
    }
    if (!adminId) {
        throw new Error('Missing parentAdminId in users/{uid} document');
    }
    if (!schoolId) {
        throw new Error('Missing schoolId in users/{uid} document');
    }
    return {
        studentId,
        adminId,
        schoolId,
        organizationId
    };
}
function getStudentEntriesPath(pathInfo) {
    const { adminId, schoolId, organizationId, studentId } = pathInfo;
    let basePath = '';
    if (organizationId) {
        basePath = `users/${adminId}/organizations/${organizationId}/schools/${schoolId}/students/${studentId}`;
    }
    else {
        basePath = `users/${adminId}/schools/${schoolId}/students/${studentId}`;
    }
    return `${basePath}/resources/stress-management/entries`;
}
function getStudentEntriesPathFor(pathInfo, moduleKey) {
    const { adminId, schoolId, organizationId, studentId } = pathInfo;
    const basePath = organizationId
        ? `users/${adminId}/organizations/${organizationId}/schools/${schoolId}/students/${studentId}`
        : `users/${adminId}/schools/${schoolId}/students/${studentId}`;
    return `${basePath}/resources/${moduleKey}/entries`;
}
function getStudentWellnessBadgesPath(pathInfo) {
    const { adminId, schoolId, organizationId, studentId } = pathInfo;
    const basePath = organizationId
        ? `users/${adminId}/organizations/${organizationId}/schools/${schoolId}/students/${studentId}`
        : `users/${adminId}/schools/${schoolId}/students/${studentId}`;
    return `${basePath}/wellness/badges`;
}
async function saveStudyPlan(userId, planData) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        const docData = {
            ...planData,
            type: 'study-plan',
            userId,
            createdAt: (0, firestore_1.serverTimestamp)()
        };
        const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, entriesPath), docData);
        return { success: true, id: docRef.id };
    }
    catch (error) {
        console.error('Error saving study plan:', error);
        throw error;
    }
}
function computeSleepHours(bedTime, wakeTime) {
    const [bh, bm] = bedTime.split(':').map(Number);
    const [wh, wm] = wakeTime.split(':').map(Number);
    let minutes = (wh * 60 + wm) - (bh * 60 + bm);
    if (minutes < 0)
        minutes += 24 * 60;
    return Math.round((minutes / 60) * 10) / 10;
}
async function logSleep(userId, bedTime, wakeTime, feeling) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'sleep-relaxation');
        const today = new Date().toISOString().split('T')[0];
        const logId = `sleep_${today}`;
        const summaryId = 'summary';
        const hours = computeSleepHours(bedTime, wakeTime);
        await (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
            const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
            const summaryDoc = await transaction.get(summaryRef);
            let newStreak = 1;
            let lastDate = '';
            if (summaryDoc.exists()) {
                const data = summaryDoc.data();
                const currentStreak = data.sleepStreak || 0;
                lastDate = data.lastSleepDate || '';
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                if (lastDate === today) {
                    newStreak = currentStreak;
                }
                else if (lastDate === yesterdayStr) {
                    newStreak = currentStreak + 1;
                }
                else {
                    newStreak = 1;
                }
            }
            transaction.set(logRef, {
                date: today,
                bedTime,
                wakeTime,
                feeling,
                hours,
                type: 'sleep-log',
                userId,
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            transaction.set(summaryRef, {
                type: 'stats',
                userId,
                sleepStreak: newStreak,
                lastSleepDate: today
            }, { merge: true });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error logging sleep:', error);
        throw error;
    }
}
async function getSleepLogs(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'sleep-relaxation');
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, entriesPath), (0, firestore_1.where)('type', '==', 'sleep-log'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return items.sort((a, b) => ((a === null || a === void 0 ? void 0 : a.date) < (b === null || b === void 0 ? void 0 : b.date) ? 1 : -1));
    }
    catch (error) {
        console.error('Error fetching sleep logs:', error);
        throw error;
    }
}
async function deleteSleepLog(userId, logId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'sleep-relaxation');
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, entriesPath, logId));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting sleep log:', error);
        throw error;
    }
}
async function getSleepRelaxationStats(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'sleep-relaxation');
        const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, 'summary');
        const snap = await (0, firestore_1.getDoc)(summaryRef);
        if (snap.exists())
            return snap.data();
        return { sleepStreak: 0, lastSleepDate: null };
    }
    catch (error) {
        console.error('Error fetching sleep stats:', error);
        throw error;
    }
}
async function logSelfTalk(userId, texts) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'healthy-mind-habits');
        const today = new Date().toISOString().split('T')[0];
        const logId = `selftalk_${today}`;
        const summaryId = 'summary';
        await (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
            const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
            const summaryDoc = await transaction.get(summaryRef);
            let newStreak = 1;
            let lastDate = '';
            if (summaryDoc.exists()) {
                const data = summaryDoc.data();
                const current = data.selfTalkStreak || 0;
                lastDate = data.lastSelfTalkDate || '';
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                if (lastDate === today)
                    newStreak = current;
                else if (lastDate === yesterdayStr)
                    newStreak = current + 1;
                else
                    newStreak = 1;
            }
            transaction.set(logRef, {
                date: today,
                texts,
                type: 'selftalk-log',
                userId,
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            transaction.set(summaryRef, {
                type: 'stats',
                userId,
                selfTalkStreak: newStreak,
                lastSelfTalkDate: today
            }, { merge: true });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error logging self talk:', error);
        throw error;
    }
}
async function logGratitude(userId, items) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'healthy-mind-habits');
        const today = new Date().toISOString().split('T')[0];
        const logId = `gratitude_${today}`;
        const summaryId = 'summary';
        await (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
            const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
            const summaryDoc = await transaction.get(summaryRef);
            let newStreak = 1;
            let lastDate = '';
            if (summaryDoc.exists()) {
                const data = summaryDoc.data();
                const current = data.gratitudeStreak || 0;
                lastDate = data.lastGratitudeDate || '';
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                if (lastDate === today)
                    newStreak = current;
                else if (lastDate === yesterdayStr)
                    newStreak = current + 1;
                else
                    newStreak = 1;
            }
            transaction.set(logRef, {
                date: today,
                items,
                type: 'gratitude-log',
                userId,
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            transaction.set(summaryRef, {
                type: 'stats',
                userId,
                gratitudeStreak: newStreak,
                lastGratitudeDate: today
            }, { merge: true });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error logging gratitude:', error);
        throw error;
    }
}
async function logReframe(userId, detail = {}) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'healthy-mind-habits');
        const today = new Date().toISOString().split('T')[0];
        const logId = `reframe_${today}`;
        const summaryId = 'summary';
        await (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
            const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
            const summaryDoc = await transaction.get(summaryRef);
            let newStreak = 1;
            let lastDate = '';
            if (summaryDoc.exists()) {
                const data = summaryDoc.data();
                const current = data.reframeStreak || 0;
                lastDate = data.lastReframeDate || '';
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                if (lastDate === today)
                    newStreak = current;
                else if (lastDate === yesterdayStr)
                    newStreak = current + 1;
                else
                    newStreak = 1;
            }
            transaction.set(logRef, {
                date: today,
                completed: true,
                detail,
                type: 'reframe-log',
                userId,
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            transaction.set(summaryRef, {
                type: 'stats',
                userId,
                reframeStreak: newStreak,
                lastReframeDate: today
            }, { merge: true });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error logging reframe:', error);
        throw error;
    }
}
async function getHealthyMindStats(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'healthy-mind-habits');
        const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, 'summary');
        const snap = await (0, firestore_1.getDoc)(summaryRef);
        if (snap.exists())
            return snap.data();
        return { selfTalkStreak: 0, lastSelfTalkDate: null, gratitudeStreak: 0, lastGratitudeDate: null, reframeStreak: 0, lastReframeDate: null };
    }
    catch (error) {
        console.error('Error fetching healthy mind stats:', error);
        throw error;
    }
}
async function getStudyPlans(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, entriesPath), (0, firestore_1.where)('type', '==', 'study-plan'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return items.sort((a, b) => {
            var _a, _b, _c, _d;
            const ta = ((_a = a === null || a === void 0 ? void 0 : a.createdAt) === null || _a === void 0 ? void 0 : _a.toMillis) ? a.createdAt.toMillis() : (((_b = a === null || a === void 0 ? void 0 : a.createdAt) === null || _b === void 0 ? void 0 : _b.seconds) ? a.createdAt.seconds * 1000 : 0);
            const tb = ((_c = b === null || b === void 0 ? void 0 : b.createdAt) === null || _c === void 0 ? void 0 : _c.toMillis) ? b.createdAt.toMillis() : (((_d = b === null || b === void 0 ? void 0 : b.createdAt) === null || _d === void 0 ? void 0 : _d.seconds) ? b.createdAt.seconds * 1000 : 0);
            return tb - ta;
        });
    }
    catch (error) {
        console.error('Error fetching study plans:', error);
        throw error;
    }
}
async function deleteStudyPlan(userId, planId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, entriesPath, planId));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting study plan:', error);
        throw error;
    }
}
async function saveFocusStudyPlan(userId, planData) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'focus-study-skill');
        const docData = {
            ...planData,
            type: 'study-plan',
            userId,
            createdAt: (0, firestore_1.serverTimestamp)()
        };
        const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, entriesPath), docData);
        return { success: true, id: docRef.id };
    }
    catch (error) {
        console.error('Error saving focus study plan:', error);
        throw error;
    }
}
async function getFocusStudyPlans(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'focus-study-skill');
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, entriesPath), (0, firestore_1.where)('type', '==', 'study-plan'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return items.sort((a, b) => {
            var _a, _b, _c, _d;
            const ta = ((_a = a === null || a === void 0 ? void 0 : a.createdAt) === null || _a === void 0 ? void 0 : _a.toMillis) ? a.createdAt.toMillis() : (((_b = a === null || a === void 0 ? void 0 : a.createdAt) === null || _b === void 0 ? void 0 : _b.seconds) ? a.createdAt.seconds * 1000 : 0);
            const tb = ((_c = b === null || b === void 0 ? void 0 : b.createdAt) === null || _c === void 0 ? void 0 : _c.toMillis) ? b.createdAt.toMillis() : (((_d = b === null || b === void 0 ? void 0 : b.createdAt) === null || _d === void 0 ? void 0 : _d.seconds) ? b.createdAt.seconds * 1000 : 0);
            return tb - ta;
        });
    }
    catch (error) {
        console.error('Error fetching focus study plans:', error);
        throw error;
    }
}
async function deleteFocusStudyPlan(userId, planId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'focus-study-skill');
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, entriesPath, planId));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting focus study plan:', error);
        throw error;
    }
}
async function saveSupportCircle(userId, circleData) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'peer-support-sharing');
        const docData = {
            ...circleData,
            type: 'support-circle',
            userId,
            createdAt: (0, firestore_1.serverTimestamp)()
        };
        const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(firebase_1.db, entriesPath), docData);
        return { success: true, id: docRef.id };
    }
    catch (error) {
        console.error('Error saving support circle:', error);
        throw error;
    }
}
async function getSupportCircles(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'peer-support-sharing');
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, entriesPath), (0, firestore_1.where)('type', '==', 'support-circle'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return items.sort((a, b) => {
            var _a, _b, _c, _d;
            const ta = ((_a = a === null || a === void 0 ? void 0 : a.createdAt) === null || _a === void 0 ? void 0 : _a.toMillis) ? a.createdAt.toMillis() : (((_b = a === null || a === void 0 ? void 0 : a.createdAt) === null || _b === void 0 ? void 0 : _b.seconds) ? a.createdAt.seconds * 1000 : 0);
            const tb = ((_c = b === null || b === void 0 ? void 0 : b.createdAt) === null || _c === void 0 ? void 0 : _c.toMillis) ? b.createdAt.toMillis() : (((_d = b === null || b === void 0 ? void 0 : b.createdAt) === null || _d === void 0 ? void 0 : _d.seconds) ? b.createdAt.seconds * 1000 : 0);
            return tb - ta;
        });
    }
    catch (error) {
        console.error('Error fetching support circles:', error);
        throw error;
    }
}
async function deleteSupportCircle(userId, circleId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'peer-support-sharing');
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, entriesPath, circleId));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting support circle:', error);
        throw error;
    }
}
async function awardBadge(userId, badge) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const badgesPath = getStudentWellnessBadgesPath(pathInfo);
        const id = badge.key;
        const payload = {
            name: badge.name,
            icon: badge.icon || 'star',
            description: badge.description || '',
            earnedAt: badge.earnedAt || new Date().toISOString(),
            userId,
            createdAt: (0, firestore_1.serverTimestamp)()
        };
        await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, badgesPath, id), payload, { merge: true });
        return { success: true };
    }
    catch (error) {
        console.error('Error awarding badge:', error);
        throw error;
    }
}
async function hasBadge(userId, key) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const badgesPath = getStudentWellnessBadgesPath(pathInfo);
        const snap = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, badgesPath, key));
        return snap.exists();
    }
    catch (error) {
        console.error('Error checking badge existence:', error);
        throw error;
    }
}
async function listBadges(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const badgesPath = getStudentWellnessBadgesPath(pathInfo);
        const snapshot = await (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, badgesPath));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    catch (error) {
        console.error('Error listing badges:', error);
        throw error;
    }
}
async function deleteBadge(userId, key) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const badgesPath = getStudentWellnessBadgesPath(pathInfo);
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, badgesPath, key));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting badge:', error);
        throw error;
    }
}
async function logGrowthJournal(userId, entry) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'growth-mindset-motivation');
        const today = new Date();
        const isoDate = today.toISOString();
        const getMonday = (d) => {
            const date = new Date(d);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(date.setDate(diff));
        };
        const sameWeek = (a, b) => getMonday(a).setHours(0, 0, 0, 0) === getMonday(b).setHours(0, 0, 0, 0);
        const previousWeek = (a, b) => {
            const ma = getMonday(a);
            ma.setHours(0, 0, 0, 0);
            const mb = getMonday(b);
            mb.setHours(0, 0, 0, 0);
            const diffDays = (ma.getTime() - mb.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays === 7;
        };
        const monday = getMonday(today);
        const y = monday.getFullYear();
        const m = (monday.getMonth() + 1).toString().padStart(2, '0');
        const d = monday.getDate().toString().padStart(2, '0');
        const weekId = `${y}-${m}-${d}`;
        const logId = `journal_${weekId}`;
        const summaryId = 'summary';
        await (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
            const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
            const summaryDoc = await transaction.get(summaryRef);
            let newStreak = 1;
            let lastDateStr = '';
            if (summaryDoc.exists()) {
                const data = summaryDoc.data();
                const current = Number(data.journalStreakWeeks || 0);
                lastDateStr = data.lastJournalDate || '';
                if (lastDateStr) {
                    const last = new Date(lastDateStr);
                    if (sameWeek(today, last)) {
                        newStreak = current;
                    }
                    else if (previousWeek(today, last)) {
                        newStreak = Math.min(4, current + 1);
                    }
                    else {
                        newStreak = 1;
                    }
                }
            }
            transaction.set(logRef, {
                date: isoDate,
                goal: entry.goal,
                effort: entry.effort,
                gratitude: entry.gratitude,
                type: 'growth-journal',
                userId,
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            transaction.set(summaryRef, {
                type: 'stats',
                userId,
                journalStreakWeeks: newStreak,
                lastJournalDate: isoDate
            }, { merge: true });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error logging growth journal:', error);
        throw error;
    }
}
async function getGrowthMindsetStats(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'growth-mindset-motivation');
        const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, 'summary');
        const snap = await (0, firestore_1.getDoc)(summaryRef);
        if (snap.exists())
            return snap.data();
        return { journalStreakWeeks: 0, lastJournalDate: null };
    }
    catch (error) {
        console.error('Error fetching growth mindset stats:', error);
        throw error;
    }
}
async function getGrowthJournalEntries(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'growth-mindset-motivation');
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, entriesPath), (0, firestore_1.where)('type', '==', 'growth-journal'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return items.sort((a, b) => {
            var _a, _b, _c, _d;
            const ta = ((_a = a === null || a === void 0 ? void 0 : a.createdAt) === null || _a === void 0 ? void 0 : _a.toMillis) ? a.createdAt.toMillis() : (((_b = a === null || a === void 0 ? void 0 : a.createdAt) === null || _b === void 0 ? void 0 : _b.seconds) ? a.createdAt.seconds * 1000 : 0);
            const tb = ((_c = b === null || b === void 0 ? void 0 : b.createdAt) === null || _c === void 0 ? void 0 : _c.toMillis) ? b.createdAt.toMillis() : (((_d = b === null || b === void 0 ? void 0 : b.createdAt) === null || _d === void 0 ? void 0 : _d.seconds) ? b.createdAt.seconds * 1000 : 0);
            return tb - ta;
        });
    }
    catch (error) {
        console.error('Error fetching growth journal entries:', error);
        throw error;
    }
}
async function deleteGrowthJournalEntry(userId, entryId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPathFor(pathInfo, 'growth-mindset-motivation');
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, entriesPath, entryId));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting growth journal entry:', error);
        throw error;
    }
}
async function logExercise(userId, description) {
    console.log('Starting logExercise for userId:', userId);
    try {
        const pathInfo = await getStudentPathInfo(userId);
        console.log('Path info retrieved:', pathInfo);
        const entriesPath = getStudentEntriesPath(pathInfo);
        console.log('Entries path:', entriesPath);
        const today = new Date().toISOString().split('T')[0];
        const logId = `exercise_${today}`;
        const summaryId = 'summary';
        await (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
            const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
            const summaryDoc = await transaction.get(summaryRef);
            let newStreak = 1;
            let lastDate = '';
            if (summaryDoc.exists()) {
                const data = summaryDoc.data();
                const currentStreak = data.exerciseStreak || 0;
                lastDate = data.lastExerciseDate || '';
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                if (lastDate === today) {
                    newStreak = currentStreak;
                }
                else if (lastDate === yesterdayStr) {
                    newStreak = currentStreak + 1;
                }
                else {
                    newStreak = 1;
                }
            }
            transaction.set(logRef, {
                date: today,
                exercised: true,
                description,
                type: 'exercise-log',
                userId,
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            transaction.set(summaryRef, {
                type: 'stats',
                userId,
                exerciseStreak: newStreak,
                lastExerciseDate: today
            }, { merge: true });
        });
        console.log('Transaction completed successfully');
        return { success: true };
    }
    catch (error) {
        console.error('Error logging exercise:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
}
async function getExerciseLogs(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, entriesPath), (0, firestore_1.where)('type', '==', 'exercise-log'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return items.sort((a, b) => ((a === null || a === void 0 ? void 0 : a.date) < (b === null || b === void 0 ? void 0 : b.date) ? 1 : -1));
    }
    catch (error) {
        console.error('Error fetching exercise logs:', error);
        throw error;
    }
}
async function deleteExerciseLog(userId, logId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.db, entriesPath, logId));
        return { success: true };
    }
    catch (error) {
        console.error('Error deleting exercise log:', error);
        throw error;
    }
}
async function logHydration(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        const today = new Date().toISOString().split('T')[0];
        const logId = `hydration_${today}`;
        const summaryId = 'summary';
        await (0, firestore_1.runTransaction)(firebase_1.db, async (transaction) => {
            const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
            const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
            const summaryDoc = await transaction.get(summaryRef);
            let newStreak = 1;
            let lastDate = '';
            if (summaryDoc.exists()) {
                const data = summaryDoc.data();
                const currentStreak = data.hydrationStreak || 0;
                lastDate = data.lastHydrationDate || '';
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                if (lastDate === today) {
                    newStreak = currentStreak;
                }
                else if (lastDate === yesterdayStr) {
                    newStreak = currentStreak + 1;
                }
                else {
                    newStreak = 1;
                }
            }
            transaction.set(logRef, {
                date: today,
                completed: true,
                type: 'hydration-log',
                userId,
                createdAt: (0, firestore_1.serverTimestamp)()
            });
            transaction.set(summaryRef, {
                type: 'stats',
                userId,
                hydrationStreak: newStreak,
                lastHydrationDate: today
            }, { merge: true });
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error logging hydration:', error);
        throw error;
    }
}
async function getHydrationStatus(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        const today = new Date().toISOString().split('T')[0];
        const logId = `hydration_${today}`;
        const logRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, logId);
        const logDoc = await (0, firestore_1.getDoc)(logRef);
        return {
            hydratedToday: logDoc.exists() && logDoc.data().completed
        };
    }
    catch (error) {
        console.error('Error fetching hydration status:', error);
        throw error;
    }
}
async function getStressManagementStats(userId) {
    try {
        const pathInfo = await getStudentPathInfo(userId);
        const entriesPath = getStudentEntriesPath(pathInfo);
        const summaryId = 'summary';
        const summaryRef = (0, firestore_1.doc)(firebase_1.db, entriesPath, summaryId);
        const summaryDoc = await (0, firestore_1.getDoc)(summaryRef);
        if (summaryDoc.exists()) {
            return summaryDoc.data();
        }
        return {
            hydrationStreak: 0,
            exerciseStreak: 0,
            lastHydrationDate: null,
            lastExerciseDate: null
        };
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
}
//# sourceMappingURL=resourcesData.js.map