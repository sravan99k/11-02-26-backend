"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG10P4 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG10P4 = (questions, responsesArray) => {
    const flags = {
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
    const checkDomainHighScore = (domain, threshold = 3.5) => {
        const domainQuestions = questions.filter((q) => q.domain === domain);
        if (domainQuestions.length === 0)
            return false;
        const totalScore = domainQuestions.reduce((sum, q) => {
            const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
            return sum + ((0, flagEngine_1.getNumericValueForQuestionAnswer)(q, answer || '') || 0);
        }, 0);
        const avgScore = totalScore / domainQuestions.length;
        return avgScore >= threshold;
    };
    if (checkDomainLowScore('Relief & Recovery') || checkDomainHighScore('Post-Exam Emptiness')) {
        flags.post_exam_emptiness = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Identity & Self-Worth') || checkDomainHighScore('Identity Loss') || checkDomainHighScore('Purpose Void')) {
        flags.identity_loss = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Result Anxiety')) {
        flags.result_anxiety = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Future Orientation')) {
        flags.future_optimism_deficit = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Life Balance') || checkDomainHighScore('Disconnection')) {
        flags.life_imbalance = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Support Systems')) {
        flags.social_withdrawal = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Exam Definition')) {
        flags.exam_defined_identity = true;
        hasAnyFlag = true;
    }
    if (checkDomainLowScore('Growth Mindset')) {
        flags.fixed_mindset = true;
        hasAnyFlag = true;
    }
    if (!hasAnyFlag) {
        flags.no_flags_baseline = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG10P4 = deriveMiniFlagsForG10P4;
//# sourceMappingURL=phase4.js.map