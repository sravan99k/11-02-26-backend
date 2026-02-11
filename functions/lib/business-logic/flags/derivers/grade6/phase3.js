"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG6P3 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG6P3 = (questions, responsesArray) => {
    const flags = {
        bullying_follow_up: false,
        home_safety_follow_up: false,
        self_harm_crisis_check: false,
        motivation_burnout_check: false,
        energy_check: false,
        family_check: false,
        general_stress_check: false,
        motivation_check: false,
        social_check: false,
        strengths_check: false,
        safety_followup: false,
        no_flags_baseline: false,
    };
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
    questions.forEach((q) => {
        const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
        if (answer == null) {
            return;
        }
        const domain = q.domain;
        const subdomain = q.subdomain;
        const flagged = (0, flagEngine_1.isQuestionFlaggedByConditions)(q, answer);
        if (domain === 'Safety' &&
            subdomain === 'Home Safety' &&
            flagged) {
            flags.home_safety_follow_up = true;
            flags.safety_followup = true;
        }
        if (domain === 'Bullying' && flagged) {
            flags.bullying_follow_up = true;
        }
        if (domain === 'Safety' &&
            (subdomain === 'Self-Harm' || subdomain === 'Self-Harm Ideation') &&
            flagged) {
            flags.self_harm_crisis_check = true;
            flags.safety_followup = true;
        }
        if ((domain === 'Motivation' || domain === 'Academic') &&
            flagged) {
            flags.motivation_burnout_check = true;
            flags.motivation_check = true;
        }
        if (domain === 'Energy' && flagged) {
            flags.energy_check = true;
        }
        if (domain === 'Family' && flagged) {
            flags.family_check = true;
        }
        if (domain === 'Social' &&
            subdomain === 'Peer Connection' &&
            flagged) {
            flags.social_check = true;
        }
        if (domain === 'Emotional' &&
            (subdomain === 'Coping' || subdomain === 'Overall Mood') &&
            flagged) {
            flags.general_stress_check = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG6P3 = deriveMiniFlagsForG6P3;
//# sourceMappingURL=phase3.js.map