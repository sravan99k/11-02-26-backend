"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG8P1 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG8P1 = (questions, responsesArray) => {
    const flags = {
        academic_recheck: false,
        social_recheck: false,
        mood_recheck: false,
        bullying_recheck: false,
        no_flags_baseline: false,
        peer_susceptibility: false,
        tech_abuse: false,
        attention_issues: false,
        social_media_risk: false,
        neurodevelopmental: false,
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
        if (domain === 'Academic' &&
            (subdomain === 'Difficulty Transition' || subdomain === 'Academic Confidence') &&
            (flagged || (numeric != null && numeric >= 4))) {
            flags.academic_recheck = true;
            if (subdomain === 'Difficulty Transition') {
                flags.attention_issues = true;
            }
        }
        if (domain === 'Social' &&
            (subdomain === 'Inclusion' || subdomain === 'Peer Connection') &&
            (flagged || (numeric != null && numeric >= 4))) {
            flags.social_recheck = true;
            flags.peer_susceptibility = true;
        }
        if (domain === 'Emotional' &&
            subdomain === 'Depression Screening' &&
            flagged) {
            flags.mood_recheck = true;
        }
        if (domain === 'Bullying' && flagged) {
            flags.bullying_recheck = true;
            if (subdomain === 'Cyberbullying') {
                flags.social_media_risk = true;
                flags.tech_abuse = true;
            }
        }
        if ((domain === 'Auditory Processing' && flagged) ||
            (domain === 'Learning Disability' && flagged) ||
            (domain === 'Memory Processing' && flagged) ||
            (domain === 'Working Memory' && flagged) ||
            (domain === 'Physical Disability' && flagged)) {
            flags.neurodevelopmental = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG8P1 = deriveMiniFlagsForG8P1;
//# sourceMappingURL=phase1.js.map