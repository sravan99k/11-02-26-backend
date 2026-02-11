"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG9P4 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG9P4 = (questions, responsesArray) => {
    const flags = {
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
    if (checkDomainLowScore('Board Readiness')) {
        flags.board_exam_anxiety = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Stream Satisfaction')) {
        flags.stream_regret = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Time Management')) {
        flags.executive_dysfunction = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Emotional Resilience')) {
        flags.emotional_vulnerability = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Academic Identity')) {
        flags.academic_identity_confusion = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Peer Relationships')) {
        flags.social_isolation = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Self-Care')) {
        flags.poor_self_care = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Future Motivation')) {
        flags.future_anxiety = true;
        hasAnyFlag = true;
    }
    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG9P4 = deriveMiniFlagsForG9P4;
//# sourceMappingURL=phase4.js.map