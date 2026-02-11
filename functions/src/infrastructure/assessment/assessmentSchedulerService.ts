import { db } from "@/integrations/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import manifestData from "@/components/assessments/assessmentManifest.json";

export interface AssessmentInfo {
    id: string;
    title: string;
    type: 'major' | 'mini';
    phase: number;
    status: 'available' | 'completed' | 'locked';
    questions?: any[];
    file?: string;
    month?: string;
    dueDate?: string;
}

const MANIFEST = manifestData as any;

export const getStudentGrade = async (userId: string): Promise<number> => {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.grade) {
                if (typeof data.grade === 'string' && data.grade.toLowerCase().startsWith('grade ')) {
                    return parseInt(data.grade.toLowerCase().replace('grade ', ''));
                }
                return Number(data.grade);
            }
        }
    } catch (e) {
        console.error("Error fetching grade:", e);
    }
    return 10; // Default
};

export const getCurrentPhase = (): number => {
    const month = new Date().getMonth(); // 0 = Jan
    // Phase 1: June (5) - July (6)
    if (month >= 5 && month <= 6) return 1;
    // Phase 2: Aug (7) - Oct (9)
    if (month >= 7 && month <= 9) return 2;
    // Phase 3: Nov (10) - Jan (0)
    if (month >= 10 || month === 0) return 3;
    // Phase 4: Feb (1) - Mar (2)
    if (month >= 1 && month <= 2) return 4;

    return 1; // Default fallback
};

export const getAvailableAssessments = async (userId: string): Promise<AssessmentInfo[]> => {
    try {
        const grade = await getStudentGrade(userId);
        const gradeKey = String(grade);
        const allAssessments = MANIFEST.assessments[gradeKey] || [];

        // 1. Get student demographics to construct the correct path
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();

        if (!userData) return [];

        const { parentAdminId, schoolId, studentId, organizationId } = userData;

        // Construct the correct path matching assessmentService.js
        let assessmentsPath;
        if (organizationId) {
            assessmentsPath = `users/${parentAdminId}/organizations/${organizationId}/schools/${schoolId}/students/${studentId}/assessments`;
        } else {
            assessmentsPath = `users/${parentAdminId}/schools/${schoolId}/students/${studentId}/assessments`;
        }

        const q = query(collection(db, assessmentsPath), orderBy('assessmentDate', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        let lastAssessmentDate: Date | null = null;
        let lastType: 'major' | 'mini' | null = null;

        if (!snapshot.empty) {
            const latest = snapshot.docs[0].data();
            lastAssessmentDate = latest.assessmentDate?.toDate() || new Date(latest.assessmentDate);
            lastType = latest.assessmentType || 'major';
        }

        const result: AssessmentInfo[] = [];
        const now = new Date();

        for (const asm of allAssessments) {
            let status: 'available' | 'completed' | 'locked' = 'available';
            let nextAvailableDate: Date | null = null;

            // Interval Logic:
            // Major -> Mini 1: 20 Days
            // Mini 1 -> Mini 2: 15 Days
            if (lastAssessmentDate) {
                const diffDays = Math.ceil((now.getTime() - lastAssessmentDate.getTime()) / (1000 * 60 * 60 * 24));

                if (asm.type === 'mini' && lastType === 'major') {
                    if (diffDays < 20) {
                        status = 'locked';
                        nextAvailableDate = new Date(lastAssessmentDate);
                        nextAvailableDate.setDate(nextAvailableDate.getDate() + 20);
                    }
                } else if (asm.type === 'mini' && lastType === 'mini') {
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
    } catch (error) {
        console.error("Error getting available assessments:", error);
        return [];
    }
};

import { scheduleMiniForUser } from "./miniAssessmentService";

export const processPostAssessmentLogic = async (userId: string, grade: number, phase: number, responses: any[], results: any): Promise<void> => {
    console.log("Processing post assessment logic", { userId, grade, phase });

    // 1. Identify Flagged Domains (Medium/High Risk >= 40%)
    const flags: Record<string, boolean> = {};
    let hasSignificantFlag = false;

    Object.entries(results).forEach(([domain, data]: [string, any]) => {
        if (domain === 'overallScore' || domain === 'overall') return;

        // Threshold for a "Flag" is 40% (Medium or High)
        if (data.score >= 40) {
            flags[domain] = true;
            hasSignificantFlag = true;
        }
    });

    // 2. Determine Next Mini Assessment
    // We follow the sequence: Major -> Mini 1 -> Mini 2
    // We check the manifest to find the next mini in this phase
    const gradeKey = String(grade);
    const allAssessments = MANIFEST.assessments[gradeKey] || [];
    const phaseMinis = allAssessments.filter((a: any) => a.phase === phase && a.type === 'mini');

    if (phaseMinis.length > 0) {
        // Schedule Mini 1.1 (the first mini in the phase)
        const nextMini = phaseMinis[0];

        await scheduleMiniForUser(userId, {
            grade,
            phase,
            assessmentId: nextMini.id,
            fromAssessmentId: `g${grade}-p${phase}-major`,
            fileKey: nextMini.file,
            flags: flags, // Pass the surgical flags
            status: 'scheduled'
        });

        console.log(`[AssessmentLogic] Scheduled ${nextMini.id} for user ${userId} with flags:`, flags);
    }
};
