"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG7P3 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG7P3 = (questions, responsesArray) => {
    const flags = {
        energy_fatigue_check: false,
        motivation_check: false,
        coping_check: false,
        digital_wellbeing_check: false,
        family_support_check: false,
        bullying_check: false,
        self_harm_check: false,
        academic_check: false,
        social_check: false,
        strengths_check: false,
        student_voice_check: false,
        home_safety_check: false,
        no_flags_baseline: false,
    };
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
    questions.forEach((q) => {
        const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
        if (answer == null)
            return;
        const flagged = (0, flagEngine_1.isQuestionFlaggedByConditions)(q, answer);
        const domain = q.domain;
        if (flagged) {
            if (domain === 'Energy')
                flags.energy_fatigue_check = true;
            if (domain === 'Motivation')
                flags.motivation_check = true;
            if (domain === 'Emotional')
                flags.coping_check = true;
            if (domain === 'Digital' || domain === 'Digital Well-being')
                flags.digital_wellbeing_check = true;
            if (domain === 'Family')
                flags.family_support_check = true;
            if (domain === 'Bullying')
                flags.bullying_check = true;
            if (domain === 'Safety' && (q.subdomain === 'Self-Harm' || q.subdomain === 'Self Harm'))
                flags.self_harm_check = true;
            if (domain === 'Safety' && q.subdomain === 'Home Safety')
                flags.home_safety_check = true;
            if (domain === 'Academic')
                flags.academic_check = true;
            if (domain === 'Social')
                flags.social_check = true;
            if (domain === 'Strengths')
                flags.strengths_check = true;
            if (domain === 'Strengths')
                flags.strengths_check = true;
        }
    });
    const anyFlag = flags.energy_fatigue_check ||
        flags.motivation_check ||
        flags.coping_check ||
        flags.digital_wellbeing_check ||
        flags.family_support_check ||
        flags.bullying_check ||
        flags.self_harm_check ||
        flags.academic_check ||
        flags.social_check ||
        flags.strengths_check ||
        flags.home_safety_check ||
        flags.student_voice_check;
    if (!anyFlag) {
        flags.no_flags_baseline = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG7P3 = deriveMiniFlagsForG7P3;
//# sourceMappingURL=phase3.js.map