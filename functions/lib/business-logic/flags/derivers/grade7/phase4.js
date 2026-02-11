"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG7P4 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG7P4 = (questions, responsesArray) => {
    const flags = {
        maturity_lag: false,
        social_deficit: false,
        self_esteem_issues: false,
        transition_anxiety: false,
        resilience_deficit: false,
        family_discord: false,
        digital_wellness_issues: false,
        no_flags_baseline: false,
    };
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
    let hasAnyFlag = false;
    const checkDomainLowScore = (domain, threshold = 3) => {
        const domainQuestions = questions.filter((q) => q.domain === domain);
        if (domainQuestions.length === 0)
            return false;
        const totalScore = domainQuestions.reduce((sum, q) => {
            const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
            return sum + ((0, flagEngine_1.getNumericValueForQuestionAnswer)(q, answer || '') || 0);
        }, 0);
        const avgScore = totalScore / domainQuestions.length;
        return avgScore < threshold;
    };
    if (checkDomainLowScore('Growth')) {
        flags.maturity_lag = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Social')) {
        flags.social_deficit = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Self')) {
        flags.self_esteem_issues = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Future')) {
        flags.transition_anxiety = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Resilience')) {
        flags.resilience_deficit = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Family')) {
        flags.family_discord = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Digital')) {
        flags.digital_wellness_issues = true;
        hasAnyFlag = true;
    }
    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG7P4 = deriveMiniFlagsForG7P4;
//# sourceMappingURL=phase4.js.map