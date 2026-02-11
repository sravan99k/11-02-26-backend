import { GradePhaseConfig } from "../types";

export const grade9Configs: Record<string, GradePhaseConfig> = {
    // Grade 9 Phase 1
    "g9-p1": {
        flagDeriverKey: "deriveMiniFlagsForG9P1",
        minis: [
            {
                assessmentId: "g9-p1-adjustment",
                fileKey: "mini-1-1",
                fromAssessmentId: "g9-p1-baseline",
                when: (flags: any) => !flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
                    academic_shock_recheck: flags.academic_shock_recheck,
                    career_anxiety_recheck: flags.career_anxiety_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    mood_recheck: flags.mood_recheck,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                // Chain to Mini 1.1 for all flagged students to receive general check-in
                nextMiniId: "g9-p1-burnout",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags: any) => ({
                    academic_shock_recheck: flags.academic_shock_recheck,
                    career_anxiety_recheck: flags.career_anxiety_recheck,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g9-p1-burnout",
                fileKey: "mini-1-2",
                fromAssessmentId: "g9-p1-baseline",
                when: (flags: any) => flags.no_flags_baseline,
            },
        ],
    },

    // Grade 9 Phase 2
    "g9-p2": {
        flagDeriverKey: "deriveMiniFlagsForG9P2",
        minis: [
            {
                // Post-result emotional recovery check
                assessmentId: "g9-p2-recovery",
                fileKey: "mini-2-1",
                fromAssessmentId: "g9-p2-midterm",
                when: (flags: any) => !flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    mood_recheck: flags.mood_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g9-p2-career",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags: any) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    mood_recheck: flags.mood_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                // Mid-year career clarity/general check
                assessmentId: "g9-p2-career",
                fileKey: "mini-2-2",
                fromAssessmentId: "g9-p2-midterm",
                when: (flags: any) => flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
                    exam_stress_recheck: flags.exam_stress_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    mood_recheck: flags.mood_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },

    // Grade 9 Phase 3
    "g9-p3": {
        flagDeriverKey: "deriveMiniFlagsForG9P3",
        minis: [
            {
                assessmentId: "g9-p3-readiness",
                fileKey: "mini-3-1",
                fromAssessmentId: "g9-p3-decision",
                // Mini 3.1: targeted readiness check for any student with *any* risk flags
                // Use no_flags_baseline inverted so all non-baseline students get 3.1
                when: (flags: any) => !flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
                    // Legacy flags
                    identity_confusion_recheck: flags.identity_confusion_recheck,
                    stream_anxiety_recheck: flags.stream_anxiety_recheck,
                    home_safety_recheck: flags.home_safety_recheck,
                    self_harm_recheck: flags.self_harm_recheck,
                    stream_confidence_recheck: flags.stream_confidence_recheck,
                    board_anxiety_recheck: flags.board_anxiety_recheck,
                    emotional_readiness_recheck: flags.emotional_readiness_recheck,
                    support_access_recheck: flags.support_access_recheck,

                    // Scenario-matching flags
                    academic_check: flags.academic_check,
                    bullying_followup: flags.bullying_followup,
                    digital_wellbeing_check: flags.digital_wellbeing_check,
                    emotional_check: flags.emotional_check,
                    family_check: flags.family_check,
                    general_stress_check: flags.general_stress_check,
                    sleep_check: flags.sleep_check,
                    somatic_check: flags.somatic_check,
                    strengths_check: flags.strengths_check,
                    support_check: flags.support_check,
                    burnout_followup: flags.burnout_followup,

                    safety_followup: flags.safety_followup,

                    no_flags_baseline: flags.no_flags_baseline,
                }),
                // After targeted Readiness mini, always follow with board prep check
                nextMiniId: "g9-p3-board",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags: any) => ({
                    // Legacy flags
                    stream_confidence_recheck: flags.stream_confidence_recheck,
                    board_anxiety_recheck: flags.board_anxiety_recheck,
                    emotional_readiness_recheck: flags.emotional_readiness_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    identity_confusion_recheck: flags.identity_confusion_recheck,
                    stream_anxiety_recheck: flags.stream_anxiety_recheck,
                    home_safety_recheck: flags.home_safety_recheck,
                    self_harm_recheck: flags.self_harm_recheck,

                    // Scenario-matching flags  
                    academic_check: flags.academic_check,
                    bullying_followup: flags.bullying_followup,
                    digital_wellbeing_check: flags.digital_wellbeing_check,
                    emotional_check: flags.emotional_check,
                    family_check: flags.family_check,
                    general_stress_check: flags.general_stress_check,
                    sleep_check: flags.sleep_check,
                    somatic_check: flags.somatic_check,
                    strengths_check: flags.strengths_check,
                    support_check: flags.support_check,
                    burnout_followup: flags.burnout_followup,

                    safety_followup: flags.safety_followup,

                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g9-p3-board",
                fileKey: "mini-3-2",
                fromAssessmentId: "g9-p3-decision",
                // Mini 3.2: board prep/general check for pure baseline students only
                when: (flags: any) => flags.no_flags_baseline,
                projectFlags: (flags: any) => ({
                    // Legacy flags
                    stream_confidence_recheck: flags.stream_confidence_recheck,
                    board_anxiety_recheck: flags.board_anxiety_recheck,
                    emotional_readiness_recheck: flags.emotional_readiness_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    identity_confusion_recheck: flags.identity_confusion_recheck,
                    stream_anxiety_recheck: flags.stream_anxiety_recheck,
                    home_safety_recheck: flags.home_safety_recheck,
                    self_harm_recheck: flags.self_harm_recheck,

                    // Scenario-matching flags
                    academic_check: flags.academic_check,
                    bullying_followup: flags.bullying_followup,
                    digital_wellbeing_check: flags.digital_wellbeing_check,
                    emotional_check: flags.emotional_check,
                    family_check: flags.family_check,
                    general_stress_check: flags.general_stress_check,
                    sleep_check: flags.sleep_check,
                    somatic_check: flags.somatic_check,
                    strengths_check: flags.strengths_check,
                    support_check: flags.support_check,
                    burnout_followup: flags.burnout_followup,

                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },

    // Grade 9 Phase 4 (Exit Interview)
    "g9-p4": {
        flagDeriverKey: "deriveMiniFlagsForG9P4",
        minis: [], // Major-only assessment (Exit Interview)
    },
};
