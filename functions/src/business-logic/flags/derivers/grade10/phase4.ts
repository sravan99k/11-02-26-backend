
import { AssessmentQuestion, createResponseMap, getAnswerFromMap } from '../../assessmentUtils';
import { getNumericValueForQuestionAnswer } from '../../flagEngine';
import { MiniFlagsG10P4 } from '../types';

/**
 * Derives flags for Grade 10 Phase 4 (Post-Exam Recovery)
 * Uses domain-driven aggregation for detailed recovery analysis
 */
export const deriveMiniFlagsForG10P4 = (
    questions: any[],
    responsesArray: any[]
): MiniFlagsG10P4 => {
    const flags: MiniFlagsG10P4 = {
        post_exam_emptiness: false,
        identity_loss: false,
        result_anxiety: false,
        future_optimism_deficit: false,
        life_imbalance: false,
        social_withdrawal: false,
        exam_defined_identity: false,
        fixed_mindset: false,
        no_flags_baseline: false,
    };

    const responseMap = createResponseMap(responsesArray);
    let hasAnyFlag = false;

    // Helper to check domain scores using exact domain names from JSON
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

    // Helper for High Score checks (e.g. Identity Loss)
    const checkDomainHighScore = (domain: string, threshold: number = 3.5): boolean => {
        const domainQuestions = questions.filter((q: any) => q.domain === domain);
        if (domainQuestions.length === 0) return false;

        const totalScore = domainQuestions.reduce((sum: number, q: any) => {
            const answer = getAnswerFromMap(q, questions, responseMap);
            return sum + (getNumericValueForQuestionAnswer(q, answer || '') || 0);
        }, 0);
        const avgScore = totalScore / domainQuestions.length;

        return avgScore >= threshold;
    };

    // 1. Post-Exam Emptiness (Domain: Post-Exam Emptiness) + Relief & Recovery (Low Score)
    // Low relief (meaning high distress) or High Emptiness
    if (checkDomainLowScore('Relief & Recovery') || checkDomainHighScore('Post-Exam Emptiness')) {
        flags.post_exam_emptiness = true;
        hasAnyFlag = true;
    }

    // 2. Identity Loss (Domain: Identity & Self-Worth - Low, or Identity Loss - High)
    if (checkDomainLowScore('Identity & Self-Worth') || checkDomainHighScore('Identity Loss') || checkDomainHighScore('Purpose Void')) {
        flags.identity_loss = true;
        hasAnyFlag = true;
    }

    // 3. Result Anxiety (Domain: Result Anxiety)
    // If Managing anxiety is Low, or if Question is "Result Anxiety" and Score is High...
    // The scale in JSON M4.2 "I am managing my anxiety..." (High score = Good management).
    // So check LOW score.
    if (checkDomainLowScore('Result Anxiety')) {
        flags.result_anxiety = true;
        hasAnyFlag = true;
    }

    // 4. Future Optimism Deficit (Domain: Future Orientation)
    if (checkDomainLowScore('Future Orientation')) {
        flags.future_optimism_deficit = true;
        hasAnyFlag = true;
    }

    // 5. Life Imbalance (Domain: Life Balance, Disconnection)
    if (checkDomainLowScore('Life Balance') || checkDomainHighScore('Disconnection')) {
        flags.life_imbalance = true;
        hasAnyFlag = true;
    }

    // 6. Social Withdrawal (Domain: Support Systems)
    if (checkDomainLowScore('Support Systems')) {
        flags.social_withdrawal = true;
        hasAnyFlag = true;
    }

    // 7. Exam-Defined Identity (Domain: Exam Definition)
    // M4.F1 "One exam does not define my life" (Reverse scaled? Or direct? Text says "Low Score: Exam-defined identity")
    // "One exam does not define my life" -> Low Score (1-2) means they DON'T agree -> They think it DOES define them.
    if (checkDomainLowScore('Exam Definition')) {
        flags.exam_defined_identity = true;
        hasAnyFlag = true;
    }

    // 8. Fixed Mindset (Domain: Growth Mindset)
    if (checkDomainLowScore('Growth Mindset')) {
        flags.fixed_mindset = true;
        hasAnyFlag = true;
    }

    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }

    return flags;
};
