
import { createResponseMap, getAnswerFromMap } from '../../assessmentUtils';
import { getNumericValueForQuestionAnswer } from '../../flagEngine';
import { MiniFlagsG8P4 } from '../types';

/**
 * Derives flags for Grade 8 Phase 4 (Exit Interview)
 * Uses domain-driven aggregation (Academic, Self, Social, Study Habits, Emotional, Family, Health, Tech, Resilience)
 */
export const deriveMiniFlagsForG8P4 = (
    questions: any[],
    responsesArray: any[]
): MiniFlagsG8P4 => {
    const flags: MiniFlagsG8P4 = {
        high_school_anxiety: false,
        low_self_confidence: false,
        negative_peer_group: false,
        poor_study_skills: false,
        emotional_dysregulation: false,
        family_conflict: false,
        tech_imbalance: false,
        poor_resilience: false,
        no_flags_baseline: false,
    };

    const responseMap = createResponseMap(responsesArray);

    let hasAnyFlag = false;

    // Helper to check domain scores
    const checkDomainLowScore = (domain: string, threshold: number = 3): boolean => {
        const domainQuestions = questions.filter((q: any) => q.domain === domain);
        if (domainQuestions.length === 0) return false;

        const totalScore = domainQuestions.reduce((sum: number, q: any) => {
            const answer = getAnswerFromMap(q, questions, responseMap);
            return sum + (getNumericValueForQuestionAnswer(q, answer || '') || 0);
        }, 0);
        const avgScore = totalScore / domainQuestions.length;

        return avgScore < threshold;
    };

    // 1. High School Anxiety (Domain: Academic Readiness)
    if (checkDomainLowScore('Academic Readiness')) {
        flags.high_school_anxiety = true;
        hasAnyFlag = true;
    }

    // 2. Low Self-Confidence (Domain: Self-Confidence)
    if (checkDomainLowScore('Self-Confidence')) {
        flags.low_self_confidence = true;
        hasAnyFlag = true;
    }

    // 3. Negative Peer Group (Domain: Social Confidence)
    if (checkDomainLowScore('Social Confidence')) {
        flags.negative_peer_group = true;
        hasAnyFlag = true;
    }

    // 4. Poor Study Skills (Domain: Study Habits)
    if (checkDomainLowScore('Study Habits')) {
        flags.poor_study_skills = true;
        hasAnyFlag = true;
    }

    // 5. Emotional Dysregulation (Domain: Emotional Regulation)
    if (checkDomainLowScore('Emotional Regulation')) {
        flags.emotional_dysregulation = true;
        hasAnyFlag = true;
    }

    // 6. Family Conflict (Domain: Family Relations)
    if (checkDomainLowScore('Family Relations')) {
        flags.family_conflict = true;
        hasAnyFlag = true;
    }

    // 7. Tech Imbalance (Domain: Technology Balance)
    if (checkDomainLowScore('Technology Balance')) {
        flags.tech_imbalance = true;
        hasAnyFlag = true;
    }

    // 8. Poor Resilience (Domain: Resilience)
    if (checkDomainLowScore('Resilience')) {
        flags.poor_resilience = true;
        hasAnyFlag = true;
    }

    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }

    return flags;
};
