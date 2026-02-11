"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG9P2 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG9P2 = (questions, responsesArray) => {
    const flags = {
        exam_stress_recheck: false,
        sleep_recheck: false,
        mood_recheck: false,
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
        const numeric = (0, flagEngine_1.getNumericValueForQuestionAnswer)(q, answer);
        if ((domain === 'Exam Anxiety' && subdomain === 'Forgetting' && flagged) ||
            (domain === 'Emotional' && subdomain === 'Panic/Overwhelm' && flagged)) {
            flags.exam_stress_recheck = true;
        }
        if (domain === 'Academic' &&
            subdomain === 'Late-night Study' &&
            (flagged || (numeric != null && numeric >= 3))) {
            flags.sleep_recheck = true;
        }
        if ((domain === 'Emotional' && subdomain === 'Self-Worth' && flagged) ||
            (domain === 'Somatic' && subdomain === 'Physical Symptoms' && flagged)) {
            flags.mood_recheck = true;
        }
        if (domain === 'Family' && subdomain === 'Fear of Reaction' && flagged) {
            flags.family_pressure_recheck = true;
        }
        if (domain === 'Safety' && subdomain === 'Self-Harm' && flagged) {
            flags.self_harm_followup = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG9P2 = deriveMiniFlagsForG9P2;
//# sourceMappingURL=phase2.js.map