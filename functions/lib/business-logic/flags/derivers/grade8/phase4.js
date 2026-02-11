"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG8P4 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG8P4 = (questions, responsesArray) => {
    const flags = {
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
    if (checkDomainLowScore('Academic Readiness')) {
        flags.high_school_anxiety = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Self-Confidence')) {
        flags.low_self_confidence = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Social Confidence')) {
        flags.negative_peer_group = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Study Habits')) {
        flags.poor_study_skills = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Emotional Regulation')) {
        flags.emotional_dysregulation = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Family Relations')) {
        flags.family_conflict = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Technology Balance')) {
        flags.tech_imbalance = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Resilience')) {
        flags.poor_resilience = true;
        hasAnyFlag = true;
    }
    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG8P4 = deriveMiniFlagsForG8P4;
//# sourceMappingURL=phase4.js.map