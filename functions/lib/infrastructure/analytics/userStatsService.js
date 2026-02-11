"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionTime = exports.getTodaysCognitiveMinutes = exports.updateGameCompletion = exports.getUserStats = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("@/integrations/firebase");
const getUserStats = async (userId) => {
    try {
        const userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
        const userSnap = await (0, firestore_1.getDoc)(userRef);
        if (userSnap.exists()) {
            const userData = userSnap.data();
            return {
                gamesCompleted: userData.gamesCompleted || 0,
                totalMinutesTrained: userData.totalMinutesTrained || 0,
                currentLevel: userData.currentLevel || 'Beginner',
                completedTasks: userData.completedTasks || [],
                streak: userData.streak || 0,
                lastActiveDate: userData.lastActiveDate || new Date().toISOString().split('T')[0]
            };
        }
        else {
            const defaultStats = {
                gamesCompleted: 0,
                totalMinutesTrained: 0,
                currentLevel: 'Beginner',
                completedTasks: [],
                streak: 0,
                lastActiveDate: new Date().toISOString().split('T')[0]
            };
            await (0, firestore_1.setDoc)(userRef, defaultStats, { merge: true });
            return defaultStats;
        }
    }
    catch (error) {
        console.error('Error getting user stats:', error);
        throw error;
    }
};
exports.getUserStats = getUserStats;
const updateGameCompletion = async (userId, gameId, minutesTrained) => {
    try {
        const userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
        const userSnap = await (0, firestore_1.getDoc)(userRef);
        let currentLevel = 'Beginner';
        let gamesCompleted = 1;
        let completedTasks = [gameId];
        let streak = 1;
        const today = new Date().toISOString().split('T')[0];
        if (userSnap.exists()) {
            const userData = userSnap.data();
            const lastActive = userData.lastActiveDate || today;
            const lastDate = new Date(lastActive);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            streak = userData.streak || 0;
            if (diffDays <= 1) {
                streak = diffDays === 0 ? streak : streak + 1;
            }
            else {
                streak = 1;
            }
            gamesCompleted = (userData.gamesCompleted || 0) + 1;
            completedTasks = [...new Set([...(userData.completedTasks || []), gameId])];
            if (gamesCompleted >= 15)
                currentLevel = 'Expert';
            else if (gamesCompleted >= 8)
                currentLevel = 'Advanced';
            else if (gamesCompleted >= 3)
                currentLevel = 'Intermediate';
            else
                currentLevel = 'Beginner';
        }
        await (0, firestore_1.updateDoc)(userRef, {
            gamesCompleted,
            totalMinutesTrained: (0, firestore_1.increment)(minutesTrained),
            currentLevel,
            completedTasks,
            lastTrained: (0, firestore_1.serverTimestamp)(),
            streak,
            lastActiveDate: today
        });
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', userId));
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.organizationId) || !(userData === null || userData === void 0 ? void 0 : userData.schoolId) || !(userData === null || userData === void 0 ? void 0 : userData.studentId)) {
            throw new Error('User is not associated with a school or student record');
        }
        const sessionData = {
            userId,
            gameId,
            minutesTrained,
            startTime: firestore_1.Timestamp.fromMillis(Date.now() - (minutesTrained * 60000)),
            endTime: (0, firestore_1.serverTimestamp)(),
            score: gamesCompleted,
            level: currentLevel,
            completedAt: (0, firestore_1.serverTimestamp)(),
            organizationId: userData.organizationId,
            schoolId: userData.schoolId
        };
        const studentSessionsRef = (0, firestore_1.collection)(firebase_1.db, 'users', userId, 'organizations', userData.organizationId, 'schools', userData.schoolId, 'students', userData.studentId, 'cognitive_sessions');
        await (0, firestore_1.addDoc)(studentSessionsRef, sessionData);
        return {
            gamesCompleted,
            currentLevel,
            totalMinutesTrained: minutesTrained
        };
    }
    catch (error) {
        console.error('Error updating game completion:', error);
        throw error;
    }
};
exports.updateGameCompletion = updateGameCompletion;
const getTodaysCognitiveMinutes = async (userId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const userDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'users', userId));
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.organizationId) || !(userData === null || userData === void 0 ? void 0 : userData.schoolId) || !(userData === null || userData === void 0 ? void 0 : userData.studentId)) {
            console.warn('User is not associated with a school or student record');
            return 0;
        }
        const studentSessionsRef = (0, firestore_1.collection)(firebase_1.db, 'users', userId, 'organizations', userData.organizationId, 'schools', userData.schoolId, 'students', userData.studentId, 'cognitive_sessions');
        const q = (0, firestore_1.query)(studentSessionsRef, (0, firestore_1.where)('completedAt', '>=', firestore_1.Timestamp.fromDate(today)));
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        let totalMinutes = 0;
        querySnapshot.forEach((doc) => {
            const session = doc.data();
            if (session.minutesTrained) {
                totalMinutes += session.minutesTrained;
            }
            else if (session.startTime && session.endTime) {
                const startTime = session.startTime.toDate ? session.startTime.toDate() : new Date(session.startTime);
                const endTime = session.endTime.toDate ? session.endTime.toDate() : new Date(session.endTime);
                const durationMs = endTime.getTime() - startTime.getTime();
                totalMinutes += Math.floor(durationMs / 60000);
            }
        });
        return totalMinutes;
    }
    catch (error) {
        console.error('Error getting today\'s cognitive minutes:', error);
        return 0;
    }
};
exports.getTodaysCognitiveMinutes = getTodaysCognitiveMinutes;
const updateSessionTime = async (userId, minutesToAdd, userData) => {
    if (minutesToAdd <= 0)
        return;
    try {
        const batch = (0, firestore_1.writeBatch)(firebase_1.db);
        const userRef = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
        batch.update(userRef, {
            totalSessionMinutes: (0, firestore_1.increment)(minutesToAdd),
            lastActiveDate: new Date().toISOString().split('T')[0],
            lastSeen: (0, firestore_1.serverTimestamp)()
        });
        if (userData.schoolId && userData.studentId && userData.parentAdminId) {
            const adminId = userData.parentAdminId;
            const schoolId = userData.schoolId;
            const studentId = userData.studentId;
            const organizationId = userData.organizationId;
            const isIndependent = userData.isIndependent;
            let studentPath = '';
            if (isIndependent) {
                studentPath = `users/${adminId}/schools/${schoolId}/students/${studentId}`;
            }
            else if (organizationId) {
                studentPath = `users/${adminId}/organizations/${organizationId}/schools/${schoolId}/students/${studentId}`;
            }
            if (studentPath) {
                const studentRef = (0, firestore_1.doc)(firebase_1.db, studentPath);
                const TARGET_MINUTES = 600;
                batch.update(studentRef, {
                    totalUsageMinutes: (0, firestore_1.increment)(minutesToAdd),
                    lastActivity: new Date().toISOString().split('T')[0]
                });
            }
        }
        await batch.commit();
    }
    catch (error) {
        console.error('Error updating session time:', error);
    }
};
exports.updateSessionTime = updateSessionTime;
//# sourceMappingURL=userStatsService.js.map