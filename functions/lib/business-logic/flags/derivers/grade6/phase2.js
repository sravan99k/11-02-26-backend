"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG6P2 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG6P2 = (questions, responsesArray) => {
    const flags = {
        exam_stress: false,
        self_harm: false,
        family_support: false,
        sleep_issues: false,
        bullying: false,
        no_flags_mid_year: false,
        exam_stress_recheck: false,
        exam_stress_final_check: false,
        sleep_recheck: false,
        sleep_final_check: false,
        family_support_recheck: false,
        family_support_final: false,
        self_harm_recheck: false,
        self_harm_crisis_check: false,
        bullying_check: false,
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
        if (flagged &&
            (domain === 'Exam Stress' ||
                (domain === 'Emotional' && (subdomain === 'Anxiety' || subdomain === 'Overwhelm')))) {
            flags.exam_stress = true;
            flags.exam_stress_recheck = true;
            flags.exam_stress_final_check = true;
        }
        if (domain === 'Sleep' && flagged) {
            flags.sleep_issues = true;
            flags.sleep_recheck = true;
            flags.sleep_final_check = true;
        }
        if (domain === 'Bullying' && flagged) {
            flags.bullying = true;
            flags.bullying_check = true;
        }
        if (domain === 'Family' &&
            subdomain === 'Family Support' &&
            (flagged || (numeric != null && numeric <= 2))) {
            flags.family_support = true;
            flags.family_support_recheck = true;
            flags.family_support_final = true;
        }
        if (domain === 'Safety' &&
            subdomain === 'Self-Harm Ideation' &&
            flagged) {
            flags.self_harm = true;
            flags.self_harm_recheck = true;
            flags.self_harm_crisis_check = true;
        }
        if (domain === 'Academic Support' && flagged) {
            flags.exam_stress = true;
        }
        if (domain === 'Social' &&
            subdomain === 'Peer Connection' &&
            flagged) {
            flags.bullying = true;
        }
        if (domain === 'Strengths' && flagged) {
            flags.exam_stress = true;
        }
        if (domain === 'Support' &&
            subdomain === 'Support Needs' &&
            flagged) {
            flags.family_support = true;
        }
    });
    if (!flags.exam_stress &&
        !flags.self_harm &&
        !flags.family_support &&
        !flags.sleep_issues &&
        !flags.bullying) {
        flags.no_flags_mid_year = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG6P2 = deriveMiniFlagsForG6P2;
//# sourceMappingURL=phase2.js.map