"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG9P3 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG9P3 = (questions, responsesArray) => {
    const flags = {
        identity_confusion_recheck: false,
        stream_anxiety_recheck: false,
        home_safety_recheck: false,
        self_harm_recheck: false,
        stream_confidence_recheck: false,
        board_anxiety_recheck: false,
        emotional_readiness_recheck: false,
        support_access_recheck: false,
        academic_check: false,
        bullying_followup: false,
        digital_wellbeing_check: false,
        emotional_check: false,
        family_check: false,
        general_stress_check: false,
        sleep_check: false,
        somatic_check: false,
        strengths_check: false,
        support_check: false,
        burnout_followup: false,
        safety_followup: false,
        no_flags_baseline: false,
    };
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
    const allDomains = new Set();
    const flaggedDomains = new Set();
    questions.forEach((q) => {
        const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
        if (answer == null) {
            return;
        }
        const domain = q.domain;
        const subdomain = q.subdomain;
        const flagged = (0, flagEngine_1.isQuestionFlaggedByConditions)(q, answer);
        if (domain) {
            allDomains.add(domain);
            if (flagged) {
                flaggedDomains.add(domain);
            }
        }
        if (domain === 'Emotional' && subdomain === 'Self-Worth' && flagged) {
            flags.identity_confusion_recheck = true;
            flags.emotional_readiness_recheck = true;
            flags.emotional_check = true;
        }
        if (domain === 'Academic' && subdomain === 'Planning' && flagged) {
            flags.stream_anxiety_recheck = true;
            flags.stream_confidence_recheck = true;
            flags.academic_check = true;
        }
        if (domain === 'Family' && subdomain === 'Listening/Support' && flagged) {
            flags.home_safety_recheck = true;
            flags.support_access_recheck = true;
            flags.family_check = true;
            flags.safety_followup = true;
        }
        if (domain === 'Digital Well-being' && subdomain === 'Isolation' && flagged) {
            flags.support_access_recheck = true;
            flags.digital_wellbeing_check = true;
            flags.support_check = true;
        }
        if (domain === 'Emotional' && subdomain === 'Hopelessness Screening' && flagged) {
            flags.board_anxiety_recheck = true;
            flags.emotional_readiness_recheck = true;
            flags.emotional_check = true;
        }
        if (domain === 'Safety' && subdomain === 'Self-Harm' && flagged) {
            flags.self_harm_recheck = true;
            flags.safety_followup = true;
        }
        if (domain === 'Bullying' && flagged) {
            flags.bullying_followup = true;
        }
        if (domain === 'Emotional' && !subdomain && flagged) {
            flags.emotional_check = true;
        }
        if (domain === 'Sleep' && flagged) {
            flags.sleep_check = true;
        }
        if (domain === 'Somatic' && flagged) {
            flags.board_anxiety_recheck = true;
            flags.somatic_check = true;
        }
        if (domain === 'Academic' && !subdomain && flagged) {
            flags.academic_check = true;
        }
        if (domain === 'Burnout' && flagged) {
            flags.burnout_followup = true;
        }
        if (domain === 'Strengths' && flagged) {
            flags.strengths_check = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    console.log('[G9P3 FlagDeriver] Domains present in major:', Array.from(allDomains));
    console.log('[G9P3 FlagDeriver] Domains with any flagged responses:', Array.from(flaggedDomains));
    console.log('[G9P3 FlagDeriver] Derived flags:', flags);
    return flags;
};
exports.deriveMiniFlagsForG9P3 = deriveMiniFlagsForG9P3;
//# sourceMappingURL=phase3.js.map