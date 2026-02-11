"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG6P4 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG6P4 = (questions, responsesArray) => {
    const flags = {
        growth_stagnation: false,
        resilience_gap: false,
        future_anxiety: false,
        social_stagnation: false,
        emotional_regulation_gap: false,
        self_esteem_drop: false,
        no_flags_baseline: false,
    };
    let hasAnyFlag = false;
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
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
        flags.growth_stagnation = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Resilience')) {
        flags.resilience_gap = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Future')) {
        flags.future_anxiety = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Social')) {
        flags.social_stagnation = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Emotional')) {
        flags.emotional_regulation_gap = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Self')) {
        flags.self_esteem_drop = true;
        hasAnyFlag = true;
    }
    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG6P4 = deriveMiniFlagsForG6P4;
//# sourceMappingURL=phase4.js.map