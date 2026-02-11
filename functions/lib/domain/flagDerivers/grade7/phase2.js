"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG7P2 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG7P2 = (questions, responsesArray) => {
    const flags = {
        exam_stress_check: false,
        sleep_check: false,
        family_pressure_check: false,
        self_harm_followup: false,
        bullying_followup: false,
        emotional_overwhelm_recheck: false,
        academic_support_check: false,
        general_stress_check: false,
        social_check: false,
        strengths_check: false,
        no_flags_mid_year: false,
    };
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
    questions.forEach((q) => {
        const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
        if (answer == null)
            return;
        const domain = q.domain;
        const subdomain = q.subdomain;
        const flagged = (0, flagEngine_1.isQuestionFlaggedByConditions)(q, answer);
        if (domain === 'Exam Stress' && flagged) {
            flags.exam_stress_check = true;
        }
        if (domain === 'Sleep' && flagged) {
            flags.sleep_check = true;
        }
        if (domain === 'Family' && flagged) {
            flags.family_pressure_check = true;
        }
        if (domain === 'Emotional' &&
            subdomain === 'Overwhelm' &&
            flagged) {
            flags.emotional_overwhelm_recheck = true;
        }
        if (domain === 'Safety' &&
            subdomain === 'Self-Harm' &&
            flagged) {
            flags.self_harm_followup = true;
        }
        if (domain === 'Bullying' && flagged) {
            flags.bullying_followup = true;
        }
        if (domain === 'Academic Support' && flagged) {
            flags.academic_support_check = true;
        }
        if (domain === 'Social' && flagged) {
            flags.social_check = true;
        }
        if (domain === 'Support' && flagged) {
            flags.academic_support_check = true;
        }
    });
    const anyFlag = flags.exam_stress_check ||
        flags.sleep_check ||
        flags.family_pressure_check ||
        flags.self_harm_followup ||
        flags.bullying_followup ||
        flags.emotional_overwhelm_recheck ||
        flags.academic_support_check ||
        flags.general_stress_check ||
        flags.social_check ||
        flags.strengths_check;
    if (!anyFlag) {
        flags.no_flags_mid_year = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG7P2 = deriveMiniFlagsForG7P2;
//# sourceMappingURL=phase2.js.map