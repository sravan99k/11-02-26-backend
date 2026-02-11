"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grade7Configs = void 0;
exports.grade7Configs = {
    "g7-p1": {
        flagDeriverKey: "deriveMiniFlagsForG7P1",
        minis: [
            {
                assessmentId: "g7-p1-social",
                fileKey: "mini-1-1",
                fromAssessmentId: "g7-p1-identity",
                when: (flags) => Boolean(flags.body_image ||
                    flags.peer_pressure ||
                    flags.digital_anxiety ||
                    flags.disengaged ||
                    flags.bullying_followup ||
                    flags.general_stress_check ||
                    flags.mood_check ||
                    flags.somatic_check ||
                    flags.strengths_check ||
                    flags.support_check ||
                    flags.adhd_screen_followup ||
                    flags.academic_skills_followup ||
                    flags.anger_coping_followup ||
                    flags.girls_health_followup ||
                    flags.ld_screen_followup ||
                    flags.memory_strategies_followup ||
                    flags.romantic_followup ||
                    flags.self_followup ||
                    flags.self_harm_followup ||
                    flags.substance_detail_followup ||
                    flags.tech_followup),
                projectFlags: (flags) => ({
                    body_image: flags.body_image,
                    peer_pressure: flags.peer_pressure,
                    digital_anxiety: flags.digital_anxiety,
                    disengaged: flags.disengaged,
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    belonging_recheck: flags.belonging_recheck,
                    mood_recheck: flags.mood_recheck,
                    bullying_recheck: flags.bullying_recheck,
                    bullying_followup: flags.bullying_followup,
                    general_stress_check: flags.general_stress_check,
                    mood_check: flags.mood_check,
                    somatic_check: flags.somatic_check,
                    strengths_check: flags.strengths_check,
                    support_check: flags.support_check,
                    adhd_screen_followup: flags.adhd_screen_followup,
                    academic_skills_followup: flags.academic_skills_followup,
                    anger_coping_followup: flags.anger_coping_followup,
                    cyberbullying_followup: flags.cyberbullying_followup,
                    emotional_literacy_followup: flags.emotional_literacy_followup,
                    girls_health_followup: flags.girls_health_followup,
                    ld_screen_followup: flags.ld_screen_followup,
                    memory_strategies_followup: flags.memory_strategies_followup,
                    romantic_followup: flags.romantic_followup,
                    self_followup: flags.self_followup,
                    self_harm_followup: flags.self_harm_followup,
                    social_media_risk_followup: flags.social_media_risk_followup,
                    social_media_safety_followup: flags.social_media_safety_followup,
                    substance_detail_followup: flags.substance_detail_followup,
                    tech_followup: flags.tech_followup,
                    general_social_check: flags.general_social_check,
                    social_inclusion_followup: flags.social_inclusion_followup,
                    peer_connection_followup: flags.peer_connection_followup,
                    digital_stress_followup: flags.digital_stress_followup,
                    mood_loneliness_followup: flags.mood_loneliness_followup,
                    academic_confidence_check: flags.academic_confidence_check,
                    adult_support_check: flags.adult_support_check,
                    family_check: flags.family_check,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g7-p1-circle",
                nextMiniCondition: (flags) => Boolean(flags.academic_confidence_recheck ||
                    flags.belonging_recheck ||
                    flags.mood_recheck ||
                    flags.bullying_recheck ||
                    flags.no_flags_baseline ||
                    flags.social_inclusion_followup ||
                    flags.peer_connection_followup ||
                    flags.cyberbullying_followup ||
                    flags.digital_stress_followup ||
                    flags.mood_loneliness_followup ||
                    flags.academic_confidence_check ||
                    flags.adult_support_check ||
                    flags.family_check ||
                    flags.emotional_literacy_followup ||
                    flags.social_media_risk_followup ||
                    flags.social_media_safety_followup),
                nextMiniProjectFlags: (flags) => ({
                    body_image: flags.body_image,
                    peer_pressure: flags.peer_pressure,
                    digital_anxiety: flags.digital_anxiety,
                    disengaged: flags.disengaged,
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    belonging_recheck: flags.belonging_recheck,
                    mood_recheck: flags.mood_recheck,
                    bullying_recheck: flags.bullying_recheck,
                    bullying_followup: flags.bullying_followup,
                    general_stress_check: flags.general_stress_check,
                    mood_check: flags.mood_check,
                    somatic_check: flags.somatic_check,
                    strengths_check: flags.strengths_check,
                    support_check: flags.support_check,
                    adhd_screen_followup: flags.adhd_screen_followup,
                    academic_skills_followup: flags.academic_skills_followup,
                    anger_coping_followup: flags.anger_coping_followup,
                    cyberbullying_followup: flags.cyberbullying_followup,
                    emotional_literacy_followup: flags.emotional_literacy_followup,
                    girls_health_followup: flags.girls_health_followup,
                    ld_screen_followup: flags.ld_screen_followup,
                    memory_strategies_followup: flags.memory_strategies_followup,
                    romantic_followup: flags.romantic_followup,
                    self_followup: flags.self_followup,
                    self_harm_followup: flags.self_harm_followup,
                    social_media_risk_followup: flags.social_media_risk_followup,
                    social_media_safety_followup: flags.social_media_safety_followup,
                    substance_detail_followup: flags.substance_detail_followup,
                    tech_followup: flags.tech_followup,
                    general_social_check: flags.general_social_check,
                    social_inclusion_followup: flags.social_inclusion_followup,
                    peer_connection_followup: flags.peer_connection_followup,
                    digital_stress_followup: flags.digital_stress_followup,
                    mood_loneliness_followup: flags.mood_loneliness_followup,
                    academic_confidence_check: flags.academic_confidence_check,
                    adult_support_check: flags.adult_support_check,
                    family_check: flags.family_check,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g7-p1-circle",
                fileKey: "mini-1-2",
                fromAssessmentId: "g7-p1-identity",
                when: (flags) => Boolean(!flags.body_image &&
                    (flags.academic_confidence_recheck ||
                        flags.belonging_recheck ||
                        flags.mood_recheck ||
                        flags.bullying_recheck ||
                        flags.no_flags_baseline ||
                        flags.social_inclusion_followup ||
                        flags.peer_connection_followup ||
                        flags.cyberbullying_followup ||
                        flags.digital_stress_followup ||
                        flags.mood_loneliness_followup ||
                        flags.academic_confidence_check ||
                        flags.adult_support_check ||
                        flags.family_check ||
                        flags.emotional_literacy_followup ||
                        flags.social_media_risk_followup ||
                        flags.social_media_safety_followup)),
                projectFlags: (flags) => ({
                    body_image: flags.body_image,
                    peer_pressure: flags.peer_pressure,
                    digital_anxiety: flags.digital_anxiety,
                    disengaged: flags.disengaged,
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    belonging_recheck: flags.belonging_recheck,
                    mood_recheck: flags.mood_recheck,
                    bullying_recheck: flags.bullying_recheck,
                    bullying_followup: flags.bullying_followup,
                    general_stress_check: flags.general_stress_check,
                    mood_check: flags.mood_check,
                    somatic_check: flags.somatic_check,
                    strengths_check: flags.strengths_check,
                    support_check: flags.support_check,
                    adhd_screen_followup: flags.adhd_screen_followup,
                    academic_skills_followup: flags.academic_skills_followup,
                    anger_coping_followup: flags.anger_coping_followup,
                    cyberbullying_followup: flags.cyberbullying_followup,
                    emotional_literacy_followup: flags.emotional_literacy_followup,
                    girls_health_followup: flags.girls_health_followup,
                    ld_screen_followup: flags.ld_screen_followup,
                    memory_strategies_followup: flags.memory_strategies_followup,
                    romantic_followup: flags.romantic_followup,
                    self_followup: flags.self_followup,
                    self_harm_followup: flags.self_harm_followup,
                    social_media_risk_followup: flags.social_media_risk_followup,
                    social_media_safety_followup: flags.social_media_safety_followup,
                    substance_detail_followup: flags.substance_detail_followup,
                    tech_followup: flags.tech_followup,
                    general_social_check: flags.general_social_check,
                    social_inclusion_followup: flags.social_inclusion_followup,
                    peer_connection_followup: flags.peer_connection_followup,
                    digital_stress_followup: flags.digital_stress_followup,
                    mood_loneliness_followup: flags.mood_loneliness_followup,
                    academic_confidence_check: flags.academic_confidence_check,
                    adult_support_check: flags.adult_support_check,
                    family_check: flags.family_check,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },
    "g7-p2": {
        flagDeriverKey: "deriveMiniFlagsForG7P2",
        minis: [
            {
                assessmentId: "g7-p2-result",
                fileKey: "mini-2-1",
                fromAssessmentId: "g7-p2-preexam",
                when: (flags) => Boolean(flags.exam_stress_check ||
                    flags.sleep_check ||
                    flags.family_pressure_check ||
                    flags.self_harm_followup ||
                    flags.bullying_followup ||
                    flags.emotional_overwhelm_recheck ||
                    flags.academic_support_check ||
                    flags.general_stress_check ||
                    flags.social_check ||
                    flags.strengths_check),
                projectFlags: (flags) => ({
                    exam_stress_check: flags.exam_stress_check,
                    sleep_check: flags.sleep_check,
                    family_pressure_check: flags.family_pressure_check,
                    self_harm_followup: flags.self_harm_followup,
                    bullying_followup: flags.bullying_followup,
                    emotional_overwhelm_recheck: flags.emotional_overwhelm_recheck,
                    academic_support_check: flags.academic_support_check,
                    general_stress_check: flags.general_stress_check,
                    social_check: flags.social_check,
                    strengths_check: flags.strengths_check,
                    no_flags_mid_year: flags.no_flags_mid_year,
                }),
                nextMiniId: "g7-p2-energy",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    exam_stress_check: flags.exam_stress_check,
                    sleep_check: flags.sleep_check,
                    family_pressure_check: flags.family_pressure_check,
                    self_harm_followup: flags.self_harm_followup,
                    bullying_followup: flags.bullying_followup,
                    emotional_overwhelm_recheck: flags.emotional_overwhelm_recheck,
                    academic_support_check: flags.academic_support_check,
                    general_stress_check: flags.general_stress_check,
                    social_check: flags.social_check,
                    strengths_check: flags.strengths_check,
                    no_flags_mid_year: flags.no_flags_mid_year,
                }),
            },
            {
                assessmentId: "g7-p2-energy",
                fileKey: "mini-2-2",
                fromAssessmentId: "g7-p2-preexam",
                when: (flags) => !Boolean(flags.exam_stress_check ||
                    flags.sleep_check ||
                    flags.family_pressure_check ||
                    flags.self_harm_followup ||
                    flags.bullying_followup ||
                    flags.emotional_overwhelm_recheck ||
                    flags.academic_support_check ||
                    flags.general_stress_check ||
                    flags.social_check ||
                    flags.strengths_check),
                projectFlags: (flags) => ({
                    exam_stress_check: flags.exam_stress_check,
                    sleep_check: flags.sleep_check,
                    family_pressure_check: flags.family_pressure_check,
                    self_harm_followup: flags.self_harm_followup,
                    bullying_followup: flags.bullying_followup,
                    emotional_overwhelm_recheck: flags.emotional_overwhelm_recheck,
                    academic_support_check: flags.academic_support_check,
                    general_stress_check: flags.general_stress_check,
                    social_check: flags.social_check,
                    strengths_check: flags.strengths_check,
                    no_flags_mid_year: flags.no_flags_mid_year,
                }),
            },
        ],
    },
    "g7-p3": {
        flagDeriverKey: "deriveMiniFlagsForG7P3",
        minis: [
            {
                assessmentId: "g7-p3-exam",
                fileKey: "mini-3-1",
                fromAssessmentId: "g7-p3-peer",
                when: (flags) => Boolean(flags.energy_fatigue_check ||
                    flags.motivation_check ||
                    flags.coping_check ||
                    flags.digital_wellbeing_check ||
                    flags.family_support_check ||
                    flags.bullying_check ||
                    flags.self_harm_check ||
                    flags.academic_check ||
                    flags.social_check ||
                    flags.strengths_check ||
                    flags.student_voice_check ||
                    flags.home_safety_check),
                projectFlags: (flags) => ({
                    energy_fatigue_check: flags.energy_fatigue_check,
                    motivation_check: flags.motivation_check,
                    coping_check: flags.coping_check,
                    digital_wellbeing_check: flags.digital_wellbeing_check,
                    family_support_check: flags.family_support_check,
                    bullying_check: flags.bullying_check,
                    self_harm_check: flags.self_harm_check,
                    academic_check: flags.academic_check,
                    social_check: flags.social_check,
                    strengths_check: flags.strengths_check,
                    student_voice_check: flags.student_voice_check,
                    home_safety_check: flags.home_safety_check,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g7-p3-final",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    energy_fatigue_check: flags.energy_fatigue_check,
                    motivation_check: flags.motivation_check,
                    coping_check: flags.coping_check,
                    digital_wellbeing_check: flags.digital_wellbeing_check,
                    family_support_check: flags.family_support_check,
                    bullying_check: flags.bullying_check,
                    self_harm_check: flags.self_harm_check,
                    academic_check: flags.academic_check,
                    social_check: flags.social_check,
                    strengths_check: flags.strengths_check,
                    student_voice_check: flags.student_voice_check,
                    home_safety_check: flags.home_safety_check,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g7-p3-final",
                fileKey: "mini-3-2",
                fromAssessmentId: "g7-p3-peer",
                when: (flags) => !Boolean(flags.energy_fatigue_check ||
                    flags.motivation_check ||
                    flags.coping_check ||
                    flags.digital_wellbeing_check ||
                    flags.family_support_check ||
                    flags.bullying_check ||
                    flags.self_harm_check ||
                    flags.academic_check ||
                    flags.social_check ||
                    flags.strengths_check ||
                    flags.student_voice_check ||
                    flags.home_safety_check),
                projectFlags: (flags) => ({
                    energy_fatigue_check: flags.energy_fatigue_check,
                    motivation_check: flags.motivation_check,
                    coping_check: flags.coping_check,
                    digital_wellbeing_check: flags.digital_wellbeing_check,
                    family_support_check: flags.family_support_check,
                    bullying_check: flags.bullying_check,
                    self_harm_check: flags.self_harm_check,
                    academic_check: flags.academic_check,
                    social_check: flags.social_check,
                    strengths_check: flags.strengths_check,
                    student_voice_check: flags.student_voice_check,
                    home_safety_check: flags.home_safety_check,
                }),
            },
        ],
    },
    "g7-p4": {
        flagDeriverKey: "deriveMiniFlagsForG7P4",
        minis: [],
    },
};
//# sourceMappingURL=grade7.js.map