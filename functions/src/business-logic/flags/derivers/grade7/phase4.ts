import { createResponseMap, getAnswerFromMap } from '../../assessmentUtils';
import { getNumericValueForQuestionAnswer } from '../../flagEngine';
import { MiniFlagsG7P4 } from '../types';

/**
 * Derives flags for Grade 7 Phase 4 (Exit Interview)
 * Uses domain-driven aggregation (Growth, Social, Self, Future, Resilience, Family, Digital)
 */
export const deriveMiniFlagsForG7P4 = (
    questions: any[],
    responsesArray: any[]
): MiniFlagsG7P4 => {
    const flags: MiniFlagsG7P4 = {
        maturity_lag: false,
        social_deficit: false,
        self_esteem_issues: false,
        transition_anxiety: false,
        resilience_deficit: false,
        family_discord: false,
        digital_wellness_issues: false,
        no_flags_baseline: false,
    };

    const responseMap = createResponseMap(responsesArray);

    let hasAnyFlag = false;

    // Helper to check domain scores (Average < 3 is concerning for positive scales)
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

    // 1. Maturity Lag (Domain: Growth)
    if (checkDomainLowScore('Growth')) {
        flags.maturity_lag = true;
        hasAnyFlag = true;
    }

    // 2. Social Deficit (Domain: Social)
    if (checkDomainLowScore('Social')) {
        flags.social_deficit = true;
        hasAnyFlag = true;
    }

    // 3. Self-Esteem Issues (Domain: Self)
    if (checkDomainLowScore('Self')) {
        flags.self_esteem_issues = true;
        hasAnyFlag = true;
    }

    // 4. Transition Anxiety (Domain: Future)
    if (checkDomainLowScore('Future')) {
        flags.transition_anxiety = true;
        hasAnyFlag = true;
    }

    // 5. Resilience Deficit (Domain: Resilience)
    if (checkDomainLowScore('Resilience')) {
        flags.resilience_deficit = true;
        hasAnyFlag = true;
    }

    // 6. Family Discord (Domain: Family)
    if (checkDomainLowScore('Family')) {
        flags.family_discord = true;
        hasAnyFlag = true;
    }

    // 7. Digital Wellness Issues (Domain: Digital)
    if (checkDomainLowScore('Digital')) {
        flags.digital_wellness_issues = true;
        hasAnyFlag = true;
    }

    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }

    return flags;
};
