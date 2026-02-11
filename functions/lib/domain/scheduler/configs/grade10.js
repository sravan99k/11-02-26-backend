"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grade10Configs = void 0;
exports.grade10Configs = {
    "g10-p1": {
        flagDeriverKey: "deriveMiniFlagsForG10P1",
        minis: [
            {
                assessmentId: "g10-p1-progress",
                fileKey: "mini-1-1",
                fromAssessmentId: "g10-p1-foundation",
                when: (flags) => !flags.no_flags_baseline,
                projectFlags: (flags) => ({
                    board_shock_recheck: flags.board_shock_recheck,
                    career_worry_recheck: flags.career_worry_recheck,
                    time_balance_recheck: flags.time_balance_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    mood_recheck: flags.mood_recheck,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g10-p1-health",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    board_shock_recheck: flags.board_shock_recheck,
                    career_worry_recheck: flags.career_worry_recheck,
                    time_balance_recheck: flags.time_balance_recheck,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g10-p1-health",
                fileKey: "mini-1-2",
                fromAssessmentId: "g10-p1-foundation",
                when: (flags) => flags.no_flags_baseline,
            },
        ],
    },
    "g10-p2": {
        flagDeriverKey: "deriveMiniFlagsForG10P2",
        minis: [
            {
                assessmentId: "g10-p2-recovery",
                fileKey: "mini-2-1",
                fromAssessmentId: "g10-p2-peak",
                when: (flags) => Boolean(flags.academic_confidence_recheck ||
                    flags.time_balance_recheck ||
                    flags.sleep_recheck ||
                    flags.family_pressure_recheck ||
                    flags.self_harm_followup),
                projectFlags: (flags) => ({
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    time_balance_recheck: flags.time_balance_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g10-p2-preboard",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    time_balance_recheck: flags.time_balance_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g10-p2-preboard",
                fileKey: "mini-2-2",
                fromAssessmentId: "g10-p2-peak",
                when: (flags) => !Boolean(flags.academic_confidence_recheck ||
                    flags.time_balance_recheck ||
                    flags.sleep_recheck ||
                    flags.family_pressure_recheck ||
                    flags.self_harm_followup),
                projectFlags: (flags) => ({
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    time_balance_recheck: flags.time_balance_recheck,
                    sleep_recheck: flags.sleep_recheck,
                    family_pressure_recheck: flags.family_pressure_recheck,
                    self_harm_followup: flags.self_harm_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },
    "g10-p3": {
        flagDeriverKey: "deriveMiniFlagsForG10P3",
        minis: [
            {
                assessmentId: "g10-p3-final",
                fileKey: "mini-3-1",
                fromAssessmentId: "g10-p3-crisis",
                when: (flags) => Boolean(flags.physical_health_recheck ||
                    flags.academic_confidence_recheck ||
                    flags.coping_skills_recheck ||
                    flags.family_support_recheck ||
                    flags.self_harm_recheck),
                projectFlags: (flags) => ({
                    physical_health_recheck: flags.physical_health_recheck,
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    coping_skills_recheck: flags.coping_skills_recheck,
                    family_support_recheck: flags.family_support_recheck,
                    self_harm_recheck: flags.self_harm_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    safety_followup: flags.safety_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
                nextMiniId: "g10-p3-mindset",
                nextMiniCondition: () => true,
                nextMiniProjectFlags: (flags) => ({
                    physical_health_recheck: flags.physical_health_recheck,
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    coping_skills_recheck: flags.coping_skills_recheck,
                    family_support_recheck: flags.family_support_recheck,
                    self_harm_recheck: flags.self_harm_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    safety_followup: flags.safety_followup,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
            {
                assessmentId: "g10-p3-mindset",
                fileKey: "mini-3-2",
                fromAssessmentId: "g10-p3-crisis",
                when: (flags) => !Boolean(flags.physical_health_recheck ||
                    flags.academic_confidence_recheck ||
                    flags.coping_skills_recheck ||
                    flags.family_support_recheck ||
                    flags.self_harm_recheck),
                projectFlags: (flags) => ({
                    physical_health_recheck: flags.physical_health_recheck,
                    academic_confidence_recheck: flags.academic_confidence_recheck,
                    coping_skills_recheck: flags.coping_skills_recheck,
                    family_support_recheck: flags.family_support_recheck,
                    self_harm_recheck: flags.self_harm_recheck,
                    support_access_recheck: flags.support_access_recheck,
                    no_flags_baseline: flags.no_flags_baseline,
                }),
            },
        ],
    },
    "g10-p4": {
        flagDeriverKey: "deriveMiniFlagsForG10P4",
        minis: [],
    },
};
//# sourceMappingURL=grade10.js.map