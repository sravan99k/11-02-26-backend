"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG10P3 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG10P3 = (questions, responsesArray) => {
    const flags = {
        physical_health_recheck: false,
        academic_confidence_recheck: false,
        coping_skills_recheck: false,
        family_support_recheck: false,
        self_harm_recheck: false,
        exam_anxiety_recheck: false,
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
        if ((domain === 'Sleep' && subdomain === 'Sleep Quality' && flagged) ||
            (domain === 'Somatic' && subdomain === 'Somatic Stress' && flagged)) {
            flags.physical_health_recheck = true;
        }
        if ((domain === 'Emotional' && subdomain === 'Confidence' && flagged) ||
            (domain === 'Academic' && subdomain === 'Strategy' && flagged)) {
            flags.academic_confidence_recheck = true;
            flags.exam_anxiety_recheck = true;
        }
        if (domain === 'Cognitive Function' && subdomain === 'Executive Function' && flagged) {
            flags.coping_skills_recheck = true;
            flags.exam_anxiety_recheck = true;
        }
        if (domain === 'Motivation' && subdomain === 'School Engagement' && flagged) {
            flags.coping_skills_recheck = true;
            flags.exam_anxiety_recheck = true;
        }
        if (domain === 'Family' && subdomain === 'Atmosphere' && flagged) {
            flags.family_support_recheck = true;
            flags.support_access_recheck = true;
        }
        if (domain === 'Social' && subdomain === 'Connection' && flagged) {
            flags.support_access_recheck = true;
        }
        if (domain === 'Safety' && subdomain === 'Suicide Risk' && flagged) {
            flags.self_harm_recheck = true;
            flags.safety_followup = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG10P3 = deriveMiniFlagsForG10P3;
//# sourceMappingURL=phase3.js.map