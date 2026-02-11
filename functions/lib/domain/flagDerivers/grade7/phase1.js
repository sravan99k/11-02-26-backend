"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG7P1 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG7P1 = (questions, responsesArray) => {
    const flags = {
        body_image: false,
        peer_pressure: false,
        digital_anxiety: false,
        disengaged: false,
        academic_confidence_recheck: false,
        belonging_recheck: false,
        mood_recheck: false,
        bullying_recheck: false,
        bullying_followup: false,
        general_stress_check: false,
        mood_check: false,
        somatic_check: false,
        strengths_check: false,
        support_check: false,
        adhd_screen_followup: false,
        academic_skills_followup: false,
        anger_coping_followup: false,
        cyberbullying_followup: false,
        emotional_literacy_followup: false,
        girls_health_followup: false,
        ld_screen_followup: false,
        memory_strategies_followup: false,
        romantic_followup: false,
        self_followup: false,
        self_harm_followup: false,
        social_media_risk_followup: false,
        social_media_safety_followup: false,
        substance_detail_followup: false,
        tech_followup: false,
        general_social_check: false,
        social_inclusion_followup: false,
        peer_connection_followup: false,
        digital_stress_followup: false,
        mood_loneliness_followup: false,
        academic_confidence_check: false,
        adult_support_check: false,
        family_check: false,
        no_flags_baseline: false,
    };
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
    questions.forEach((q) => {
        const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
        if (answer == null)
            return;
        const flagged = (0, flagEngine_1.isQuestionFlaggedByConditions)(q, answer);
        const domain = q.domain;
        const subdomain = q.subdomain;
        const section = q.section;
        if (flagged) {
            if (domain === 'ADHD Screen')
                flags.adhd_screen_followup = true;
            if (domain === 'Academic Skills')
                flags.academic_skills_followup = true;
            if (domain === 'Anger Coping')
                flags.anger_coping_followup = true;
            if (domain === 'Cyberbullying') {
                flags.cyberbullying_followup = true;
                flags.digital_anxiety = true;
            }
            if (domain === 'Emotional Literacy')
                flags.emotional_literacy_followup = true;
            if (domain === 'Girls Health')
                flags.girls_health_followup = true;
            if (domain === 'LD Screen')
                flags.ld_screen_followup = true;
            if (domain === 'Memory Strategies')
                flags.memory_strategies_followup = true;
            if (domain === 'Romantic')
                flags.romantic_followup = true;
            if (domain === 'Self')
                flags.self_followup = true;
            if (domain === 'Self-harm' || domain === 'Self-Harm')
                flags.self_harm_followup = true;
            if (domain === 'Social Media Risk')
                flags.social_media_risk_followup = true;
            if (domain === 'Social Media Safety')
                flags.social_media_safety_followup = true;
            if (domain === 'Substance Detail')
                flags.substance_detail_followup = true;
            if (domain === 'Tech')
                flags.tech_followup = true;
            if (domain === 'Bullying') {
                flags.bullying_followup = true;
                flags.bullying_recheck = true;
            }
            if (domain === 'Mood') {
                flags.mood_check = true;
                flags.mood_recheck = true;
                flags.mood_loneliness_followup = true;
            }
            if (domain === 'Somatic' || domain === 'Physical')
                flags.somatic_check = true;
            if (domain === 'Support' || domain === 'Adult Support') {
                flags.support_check = true;
                flags.adult_support_check = true;
            }
            if (domain === 'Family')
                flags.family_check = true;
            if (domain === 'Academic') {
                if (subdomain === 'Academic Confidence' || subdomain === 'Organization') {
                    flags.academic_confidence_check = true;
                    flags.academic_confidence_recheck = true;
                }
            }
            if (domain === 'Emotional') {
                flags.mood_check = true;
                flags.mood_recheck = true;
                flags.mood_loneliness_followup = true;
            }
            if (domain === 'Social') {
                flags.general_social_check = true;
                if (subdomain === 'Inclusion') {
                    flags.social_inclusion_followup = true;
                    flags.belonging_recheck = true;
                }
                if (subdomain === 'Peer Connection') {
                    flags.peer_connection_followup = true;
                    flags.peer_pressure = true;
                }
                if (section === 'Digital Stress') {
                    flags.digital_stress_followup = true;
                    flags.digital_anxiety = true;
                }
            }
        }
    });
    if (flags.academic_confidence_recheck || flags.belonging_recheck || flags.mood_recheck) {
        flags.disengaged = true;
    }
    if (Object.values(flags).every(v => v === false)) {
        flags.no_flags_baseline = true;
    }
    return flags;
};
exports.deriveMiniFlagsForG7P1 = deriveMiniFlagsForG7P1;
//# sourceMappingURL=phase1.js.map