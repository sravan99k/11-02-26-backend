import { createResponseMap, getAnswerFromMap } from '../../assessmentUtils';
import { getNumericValueForQuestionAnswer } from '../../flagEngine';
import { MiniFlagsG9P4 } from '../types';

/**
 * Derives flags for Grade 9 Phase 4 (Exit Interview)
 * Uses domain-driven aggregation (Board Readiness, Stream Satisfaction, Time Management, Resilience, Identity, Family, Peer, Self-Care, Future)
 */
export const deriveMiniFlagsForG9P4 = (
    questions: any[],
    responsesArray: any[]
): MiniFlagsG9P4 => {
    const flags: MiniFlagsG9P4 = {
        board_exam_anxiety: false,
        stream_regret: false,
        executive_dysfunction: false,
        emotional_vulnerability: false,
        academic_identity_confusion: false,
        social_isolation: false,
        poor_self_care: false,
        future_anxiety: false,
        no_flags_baseline: false,
    };

    let hasAnyFlag = false;

    const responseMap = createResponseMap(responsesArray);

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

    // 1. Board Exam Anxiety (Domain: Board Readiness)
    if (checkDomainLowScore('Board Readiness')) {
        flags.board_exam_anxiety = true;
        hasAnyFlag = true;
    }

    // 2. Stream Regret (Domain: Stream Satisfaction)
    if (checkDomainLowScore('Stream Satisfaction')) {
        flags.stream_regret = true;
        hasAnyFlag = true;
    }

    // 3. Executive Dysfunction (Domain: Time Management)
    if (checkDomainLowScore('Time Management')) {
        flags.executive_dysfunction = true;
        hasAnyFlag = true;
    }

    // 4. Emotional Vulnerability (Domain: Emotional Resilience)
    if (checkDomainLowScore('Emotional Resilience')) {
        flags.emotional_vulnerability = true;
        hasAnyFlag = true;
    }

    // 5. Academic Identity Confusion (Domain: Academic Identity)
    if (checkDomainLowScore('Academic Identity')) {
        flags.academic_identity_confusion = true;
        hasAnyFlag = true;
    }

    // 6. Social Isolation (Domain: Peer Relationships)
    if (checkDomainLowScore('Peer Relationships')) {
        flags.social_isolation = true;
        hasAnyFlag = true;
    }

    // 7. Poor Self-Care (Domain: Self-Care)
    if (checkDomainLowScore('Self-Care')) {
        flags.poor_self_care = true;
        hasAnyFlag = true;
    }

    // 8. Future Anxiety (Domain: Future Motivation)
    if (checkDomainLowScore('Future Motivation')) {
        flags.future_anxiety = true;
        hasAnyFlag = true;
    }

    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }

    return flags;
};
