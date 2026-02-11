"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG8P3 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG8P3 = (questions, responsesArray) => {
    const flags = {
        energy_motivation_recheck: false,
        academic_engagement_recheck: false,
        peer_connection_recheck: false,
        home_safety_recheck: false,
        self_harm_recheck: false,
        academic_concerns_recheck: false,
        grade9_anxiety_recheck: false,
        emotional_concerns_recheck: false,
        support_access_recheck: false,
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
        const numeric = (0, flagEngine_1.getNumericValueForQuestionAnswer)(q, answer);
        if ((domain === 'Energy' && flagged) ||
            (domain === 'Motivation' && (flagged || (numeric != null && numeric <= 2)))) {
            flags.energy_motivation_recheck = true;
            flags.academic_concerns_recheck = true;
        }
        if (domain === 'Academic' && subdomain === 'Engagement' && flagged) {
            flags.academic_engagement_recheck = true;
            flags.academic_concerns_recheck = true;
        }
        if (domain === 'Social' && subdomain === 'Connection/Isolation' && flagged) {
            flags.peer_connection_recheck = true;
        }
        if (domain === 'Emotional' && subdomain === 'Mood' && flagged) {
            flags.emotional_concerns_recheck = true;
        }
        if (domain === 'Emotional' && subdomain === 'Hopelessness Screening' && flagged) {
            flags.grade9_anxiety_recheck = true;
            flags.emotional_concerns_recheck = true;
        }
        if (domain === 'Safety' && subdomain === 'Home Safety' && flagged) {
            flags.home_safety_recheck = true;
            flags.safety_followup = true;
        }
        if (domain === 'Safety' && subdomain === 'Self-Harm' && flagged) {
            flags.self_harm_recheck = true;
            flags.safety_followup = true;
        }
        if (domain === 'Support' &&
            (flagged || (numeric != null && numeric >= 4))) {
            flags.support_access_recheck = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG8P3 = deriveMiniFlagsForG8P3;
//# sourceMappingURL=phase3.js.map