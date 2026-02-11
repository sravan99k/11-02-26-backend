import { GradePhaseConfig } from "../types";

export const grade8Configs: Record<string, GradePhaseConfig> = {
    // Grade 8 Phase 1
    "g8-p1": {
        flagDeriverKey: "deriveMiniFlagsForG8P1",
        minis: [
            {
                assessmentId: "g8-p1-risk",
                fileKey: "mini-1-1",
                fromAssessmentId: "g8-p1-transition",
                when: (flags: any) => !flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
                    // Generic rechecks
                    academic_recheck: flags.academic_recheck,
                    social_recheck: flags.social_recheck,
                    mood_recheck: flags.mood_recheck,
                    bullying_recheck: flags.bullying_recheck,

                    // Specific G8P1 Scenarios
                    peer_susceptibility: flags.peer_susceptibility,
                    tech_abuse: flags.tech_abuse,
                    attention_issues: flags.attention_issues,
                    social_media_risk: flags.social_media_risk,
                    neurodevelopmental: flags.neurodevelopmental,

                    no_flags_baseline: flags.no_flags_baseline,
                }),
                // Chain to Mini 1.2 for all flagged students to receive general check-in
                nextMiniId: "g8-p1-peer",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags: any) => ({
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
                when: (flags: any) => flags.no_flags_baseline,
            },
        ],
    },

    // Grade 8 Phase 2
    "g8-p2": {
        flagDeriverKey: "deriveMiniFlagsForG8P2",
        minis: [
            {
                // Risk recheck mini when any exam/sleep/family/self-harm risk is present
                assessmentId: "g8-p2-recovery",
                fileKey: "mini-2-1",
                fromAssessmentId: "g8-p2-preexam",
                when: (flags: any) =>
                    Boolean(
                        flags.exam_stress_recheck ||
                        flags.sleep_recheck ||
                        flags.family_pressure_recheck ||
                        flags.self_harm_followup
                    ),
                projectFlags: (flags: any) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                // For flagged students, follow with Mini 2.2 as a broader check-in
                nextMiniId: "g8-p2-energy",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags: any) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                // Mid-year / baseline check mini when no acute risk flags from M2
                assessmentId: "g8-p2-energy",
                fileKey: "mini-2-2",
                fromAssessmentId: "g8-p2-preexam",
                when: (flags: any) =>
                    !Boolean(
                        flags.exam_stress_recheck ||
                        flags.sleep_recheck ||
                        flags.family_pressure_recheck ||
                        flags.self_harm_followup
                    ),
                projectFlags: (flags: any) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },

    // Grade 8 Phase 3
    "g8-p3": {
        flagDeriverKey: "deriveMiniFlagsForG8P3",
        minis: [
            {
                // Pre-finals risk and safety check when any P3 risk is present
                assessmentId: "g8-p3-prefinals",
                fileKey: "mini-3-1",
                fromAssessmentId: "g8-p3-relationships",
                // Mini 3.1: pre-finals risk/safety check for any student with *any* P3 risk flags
                // Use no_flags_baseline inverted so all non-baseline students get 3.1
                when: (flags: any) => !flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
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
                // For flagged students, follow with Mini 3.2 cover transition readiness.
                nextMiniId: "g8-p3-mindset",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags: any) => ({
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
                // Final prep and Grade 9 readiness check for students without acute P3 risks
                assessmentId: "g8-p3-mindset",
                fileKey: "mini-3-2",
                fromAssessmentId: "g8-p3-relationships",
                // Mini 3.2: final prep/readiness for pure baseline students only
                when: (flags: any) => flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
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

    // Grade 8 Phase 4 (Exit Interview)
    "g8-p4": {
        flagDeriverKey: "deriveMiniFlagsForG8P4",
        minis: [], // Major-only assessment (Exit Interview)
    },
};
