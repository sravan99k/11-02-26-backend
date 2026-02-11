"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grade8Configs = void 0;
exports.grade8Configs = {
    "g8-p1": {
        flagDeriverKey: "deriveMiniFlagsForG8P1",
        minis: [
            {
                assessmentId: "g8-p1-risk",
                fileKey: "mini-1-1",
                fromAssessmentId: "g8-p1-transition",
                when: (flags) => !flags.no_flags_baseline,
                projectFlags: (flags) => ({
                    academic_recheck: flags.academic_recheck,
                    social_recheck: flags.social_recheck,
                    mood_recheck: flags.mood_recheck,
                    bullying_recheck: flags.bullying_recheck,
                    peer_susceptibility: flags.peer_susceptibility,
                    tech_abuse: flags.tech_abuse,
                    attention_issues: flags.attention_issues,
                    social_media_risk: flags.social_media_risk,
                    neurodevelopmental: flags.neurodevelopmental,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g8-p1-peer",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    academic_recheck: flags.academic_recheck,
                    social_recheck: flags.social_recheck,
                    mood_recheck: flags.mood_recheck,
                    bullying_recheck: flags.bullying_recheck,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g8-p1-peer",
                fileKey: "mini-1-2",
                fromAssessmentId: "g8-p1-transition",
                when: (flags) => flags.no_flags_baseline,
            },
        ],
    },
    "g8-p2": {
        flagDeriverKey: "deriveMiniFlagsForG8P2",
        minis: [
            {
                assessmentId: "g8-p2-recovery",
                fileKey: "mini-2-1",
                fromAssessmentId: "g8-p2-preexam",
                when: (flags) => Boolean(flags.exam_stress_recheck ||
                    flags.sleep_recheck ||
                    flags.family_pressure_recheck ||
                    flags.self_harm_followup),
                projectFlags: (flags) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g8-p2-energy",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g8-p2-energy",
                fileKey: "mini-2-2",
                fromAssessmentId: "g8-p2-preexam",
                when: (flags) => !Boolean(flags.exam_stress_recheck ||
                    flags.sleep_recheck ||
                    flags.family_pressure_recheck ||
                    flags.self_harm_followup),
                projectFlags: (flags) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },
    "g8-p3": {
        flagDeriverKey: "deriveMiniFlagsForG8P3",
        minis: [
            {
                assessmentId: "g8-p3-prefinals",
                fileKey: "mini-3-1",
                fromAssessmentId: "g8-p3-relationships",
                when: (flags) => !flags.no_flags_baseline,
                projectFlags: (flags) => ({
                    energy_motivation_recheck: flags.energy_motivation_recheck,
                    academic_engagement_recheck: flags.academic_engagement_recheck,
                    peer_connection_recheck: flags.peer_connection_recheck,
                    home_safety_recheck: flags.home_safety_recheck,
                    self_harm_recheck: flags.self_harm_recheck,
                    academic_concerns_recheck: flags.academic_concerns_recheck,
                    grade9_anxiety_recheck: flags.grade9_anxiety_recheck,
                    emotional_concerns_recheck: flags.emotional_concerns_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    safety_followup: flags.safety_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g8-p3-mindset",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    energy_motivation_recheck: flags.energy_motivation_recheck,
                    academic_engagement_recheck: flags.academic_engagement_recheck,
                    peer_connection_recheck: flags.peer_connection_recheck,
                    home_safety_recheck: flags.home_safety_recheck,
                    self_harm_recheck: flags.self_harm_recheck,
                    academic_concerns_recheck: flags.academic_concerns_recheck,
                    grade9_anxiety_recheck: flags.grade9_anxiety_recheck,
                    emotional_concerns_recheck: flags.emotional_concerns_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    safety_followup: flags.safety_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g8-p3-mindset",
                fileKey: "mini-3-2",
                fromAssessmentId: "g8-p3-relationships",
                when: (flags) => flags.no_flags_baseline,
                projectFlags: (flags) => ({
                    energy_motivation_recheck: flags.energy_motivation_recheck,
                    academic_engagement_recheck: flags.academic_engagement_recheck,
                    peer_connection_recheck: flags.peer_connection_recheck,
                    home_safety_recheck: flags.home_safety_recheck,
                    self_harm_recheck: flags.self_harm_recheck,
                    academic_concerns_recheck: flags.academic_concerns_recheck,
                    grade9_anxiety_recheck: flags.grade9_anxiety_recheck,
                    emotional_concerns_recheck: flags.emotional_concerns_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },
    "g8-p4": {
        flagDeriverKey: "deriveMiniFlagsForG8P4",
        minis: [],
    },
};
//# sourceMappingURL=grade8.js.map