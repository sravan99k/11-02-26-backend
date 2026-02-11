"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG6P1 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG6P1 = (questions, responsesArray) => {
    const flags = {
        academic_anxiety: false,
        social_isolation: false,
        neurodevelopmental_concerns: false,
        trauma_exposure: false,
        academic_anxiety_recheck: false,
        social_isolation_recheck: false,
        mood_concerns_recheck: false,
        bullying_recheck: false,
        bullying_followup: false,
        general_stress_check: false,
        mood_check: false,
        strengths_check: false,
        adult_support_followup: false,
        student_voice_followup: false,
        future_hope_check: false,
        adult_trust_check: false,
        self_regulation_check: false,
        self_worth_check: false,
        school_engagement_check: false,
        belonging_check: false,
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
        const flaggedByConditions = (0, flagEngine_1.isQuestionFlaggedByConditions)(q, answer);
        if (flaggedByConditions &&
            domain === 'Academic' &&
            (subdomain === 'Academic Adjustment' || subdomain === 'Academic Anxiety')) {
            flags.academic_anxiety = true;
            flags.academic_anxiety_recheck = true;
        }
        if (flaggedByConditions &&
            domain === 'Social' &&
            (subdomain === 'Peer Connection' || subdomain === 'Social Inclusion')) {
            flags.social_isolation = true;
            flags.social_isolation_recheck = true;
        }
        if (flaggedByConditions && domain === 'Mood') {
            flags.mood_concerns_recheck = true;
            flags.mood_check = true;
        }
        if (flaggedByConditions && domain === 'Bullying') {
            flags.trauma_exposure = true;
            flags.bullying_recheck = true;
            flags.bullying_followup = true;
        }
        if (flaggedByConditions && domain === 'Adult Support') {
            flags.adult_support_followup = true;
        }
        if (flaggedByConditions && domain === 'Future Hope') {
            flags.future_hope_check = true;
        }
        if (flaggedByConditions && domain === 'Adult Trust') {
            flags.adult_trust_check = true;
        }
        if (flaggedByConditions && domain === 'Self-Regulation') {
            flags.self_regulation_check = true;
        }
        if (flaggedByConditions && domain === 'Self-Worth') {
            flags.self_worth_check = true;
        }
        if (flaggedByConditions && domain === 'School Engagement') {
            flags.school_engagement_check = true;
        }
        if (flaggedByConditions && domain === 'Belonging') {
            flags.belonging_check = true;
        }
        if (flaggedByConditions && domain === 'Academic') {
            flags.neurodevelopmental_concerns = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG6P1 = deriveMiniFlagsForG6P1;
//# sourceMappingURL=phase1.js.map