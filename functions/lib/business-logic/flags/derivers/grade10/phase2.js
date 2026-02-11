"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG10P2 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG10P2 = (questions, responsesArray) => {
    const flags = {
        academic_confidence_recheck: false,
        time_balance_recheck: false,
        sleep_recheck: false,
        family_pressure_recheck: false,
        self_harm_followup: false,
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
        if ((domain === 'Exam Anxiety' && subdomain === 'Exam Stress' && flagged) ||
            (domain === 'Academic' && subdomain === 'Recall' && flagged)) {
            flags.academic_confidence_recheck = true;
        }
        if (domain === 'Academic' && subdomain === 'Late-Night' && flagged) {
            flags.time_balance_recheck = true;
            flags.sleep_recheck = true;
        }
        if (domain === 'Somatic' && subdomain === 'Somatic Stress' && flagged) {
            flags.sleep_recheck = true;
        }
        if (domain === 'Family' && subdomain === 'Fear of Disappointment' && flagged) {
            flags.family_pressure_recheck = true;
        }
        if (domain === 'Safety' && subdomain === 'Self-Harm' && flagged) {
            flags.self_harm_followup = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG10P2 = deriveMiniFlagsForG10P2;
//# sourceMappingURL=phase2.js.map