import { getNumericValueForQuestionAnswer, isQuestionFlaggedByConditions } from "./flagEngine";

export interface MiniFlagsG6P3 {
    bullying_follow_up: boolean;
    home_safety_follow_up: boolean;
    self_harm_crisis_check: boolean;
    motivation_burnout_check: boolean;
    energy_check: boolean;
    family_check: boolean;
    general_stress_check: boolean;
    motivation_check: boolean;
    social_check: boolean;
    strengths_check: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG6P1 {
    academic_anxiety: boolean;
    social_isolation: boolean;
    neurodevelopmental_concerns: boolean;
    trauma_exposure: boolean;
    academic_anxiety_recheck: boolean;
    social_isolation_recheck: boolean;
    mood_concerns_recheck: boolean;
    bullying_recheck: boolean;
    bullying_followup: boolean;
    general_stress_check: boolean;
    mood_check: boolean;
    strengths_check: boolean;
    adult_support_followup: boolean;
    student_voice_followup: boolean;
    future_hope_check: boolean;
    adult_trust_check: boolean;
    self_regulation_check: boolean;
    self_worth_check: boolean;
    school_engagement_check: boolean;
    belonging_check: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG7P1 {
    body_image: boolean;
    peer_pressure: boolean;
    digital_anxiety: boolean;
    disengaged: boolean;
    academic_confidence_recheck: boolean;
    belonging_recheck: boolean;
    mood_recheck: boolean;
    bullying_recheck: boolean;
    bullying_followup: boolean;
    general_stress_check: boolean;
    mood_check: boolean;
    somatic_check: boolean;
    strengths_check: boolean;
    support_check: boolean;
    adhd_screen_followup: boolean;
    academic_skills_followup: boolean;
    anger_coping_followup: boolean;
    cyberbullying_followup: boolean;
    emotional_literacy_followup: boolean;
    girls_health_followup: boolean;
    ld_screen_followup: boolean;
    memory_strategies_followup: boolean;
    romantic_followup: boolean;
    self_followup: boolean;
    self_harm_followup: boolean;
    social_media_risk_followup: boolean;
    social_media_safety_followup: boolean;
    substance_detail_followup: boolean;
    tech_followup: boolean;
    general_social_check: boolean;
    social_inclusion_followup: boolean;
    peer_connection_followup: boolean;
    digital_stress_followup: boolean;
    mood_loneliness_followup: boolean;
    academic_confidence_check: boolean;
    adult_support_check: boolean;
    family_check: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG6P2 {
    exam_stress: boolean;
    self_harm: boolean;
    family_support: boolean;
    sleep_issues: boolean;
    bullying: boolean;
    no_flags_mid_year: boolean;
    exam_stress_recheck: boolean;
    exam_stress_final_check: boolean;
    sleep_recheck: boolean;
    sleep_final_check: boolean;
    family_support_recheck: boolean;
    family_support_final: boolean;
    self_harm_recheck: boolean;
    self_harm_crisis_check: boolean;
    bullying_check: boolean;
}

export interface MiniFlagsG7P2 {
    exam_stress_check: boolean;
    sleep_check: boolean;
    family_pressure_check: boolean;
    self_harm_followup: boolean;
    bullying_followup: boolean;
    emotional_overwhelm_recheck: boolean;
    academic_support_check: boolean;
    general_stress_check: boolean;
    social_check: boolean;
    strengths_check: boolean;
    no_flags_mid_year: boolean;
}

export interface MiniFlagsG7P3 {
    energy_fatigue_check: boolean;
    motivation_check: boolean;
    coping_check: boolean;
    digital_wellbeing_check: boolean;
    family_support_check: boolean;
    bullying_check: boolean;
    self_harm_check: boolean;
    academic_check: boolean;
    social_check: boolean;
    strengths_check: boolean;
    student_voice_check: boolean;
    home_safety_check: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG8P1 {
    academic_recheck: boolean;
    social_recheck: boolean;
    mood_recheck: boolean;
    bullying_recheck: boolean;
    no_flags_baseline: boolean;
    peer_susceptibility: boolean;
    tech_abuse: boolean;
    attention_issues: boolean;
    social_media_risk: boolean;
    neurodevelopmental: boolean;
}

export interface MiniFlagsG8P2 {
    exam_stress_recheck: boolean;
    sleep_recheck: boolean;
    family_pressure_recheck: boolean;
    self_harm_followup: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG8P3 {
    energy_motivation_recheck: boolean;
    academic_engagement_recheck: boolean;
    peer_connection_recheck: boolean;
    home_safety_recheck: boolean;
    self_harm_recheck: boolean;
    academic_concerns_recheck: boolean;
    grade9_anxiety_recheck: boolean;
    emotional_concerns_recheck: boolean;
    support_access_recheck: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG9P1 {
    academic_shock_recheck: boolean;
    career_anxiety_recheck: boolean;
    sleep_recheck: boolean;
    mood_recheck: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG9P2 {
    exam_stress_recheck: boolean;
    sleep_recheck: boolean;
    mood_recheck: boolean;
    family_pressure_recheck: boolean;
    self_harm_followup: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG10P1 {
    board_shock_recheck: boolean;
    career_worry_recheck: boolean;
    time_balance_recheck: boolean;
    sleep_recheck: boolean;
    mood_recheck: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG9P3 {
    identity_confusion_recheck: boolean;
    stream_anxiety_recheck: boolean;
    home_safety_recheck: boolean;
    self_harm_recheck: boolean;
    stream_confidence_recheck: boolean;
    board_anxiety_recheck: boolean;
    emotional_readiness_recheck: boolean;
    support_access_recheck: boolean;
    academic_check: boolean;
    bullying_followup: boolean;
    digital_wellbeing_check: boolean;
    emotional_check: boolean;
    family_check: boolean;
    general_stress_check: boolean;
    sleep_check: boolean;
    somatic_check: boolean;
    strengths_check: boolean;
    support_check: boolean;
    burnout_followup: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG10P2 {
    academic_confidence_recheck: boolean;
    time_balance_recheck: boolean;
    sleep_recheck: boolean;
    family_pressure_recheck: boolean;
    self_harm_followup: boolean;
    no_flags_baseline: boolean;
}

export interface MiniFlagsG10P3 {
    physical_health_recheck: boolean;
    academic_confidence_recheck: boolean;
    coping_skills_recheck: boolean;
    family_support_recheck: boolean;
    self_harm_recheck: boolean;
    exam_anxiety_recheck: boolean;
    support_access_recheck: boolean;
    no_flags_baseline: boolean;
}

const logFlagDerivation = (gradePhase: string, flags: any) => {
    const flaggedDomains = Object.entries(flags)
        .filter(([key, value]) => value === true && !key.includes('no_flags'))
        .map(([key]) => key);

    console.log(`🔍 [FLAGS DERIVED FROM MAJOR - ${gradePhase}]:`, {
        allFlags: flags,
        flaggedCount: flaggedDomains.length,
        flaggedDomains: flaggedDomains.length > 0 ? flaggedDomains : ['NONE - no flags set']
    });
};

const getAnswerForQuestion = (questions: any[], responsesArray: any[], question: any): any | null => {
    if (!question) return null;

    const index = typeof question.questionNumber === 'number'
        ? question.questionNumber - 1
        : questions.indexOf(question);

    if (index < 0) return null;

    const resp = responsesArray.find((r: any) => r.questionIndex === index);
    return resp ? resp.answer : null;
};

const getAnswerByQuestionId = (questions: any[], responsesArray: any[], questionId: string): any | null => {
    const q = questions.find((question: any) => question.id === questionId);
    if (!q) return null;
    return getAnswerForQuestion(questions, responsesArray, q);
};

export const deriveMiniFlagsForG6P1 = (questions: any[], responsesArray: any[]): MiniFlagsG6P1 => {
    const flags: MiniFlagsG6P1 = {
        academic_anxiety: false, social_isolation: false, neurodevelopmental_concerns: false, trauma_exposure: false,
        academic_anxiety_recheck: false, social_isolation_recheck: false, mood_concerns_recheck: false, bullying_recheck: false,
        bullying_followup: false, general_stress_check: false, mood_check: false, strengths_check: false,
        adult_support_followup: false, student_voice_followup: false, future_hope_check: false, adult_trust_check: false,
        self_regulation_check: false, self_worth_check: false, school_engagement_check: false, belonging_check: false,
        no_flags_baseline: false,
    };

    questions.forEach((q: any) => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;

        const flaggedByConditions = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        const subdomain = q.subdomain;

        if (flaggedByConditions && domain === 'Academic' && (subdomain === 'Academic Adjustment' || subdomain === 'Academic Anxiety')) {
            flags.academic_anxiety = true;
            flags.academic_anxiety_recheck = true;
        }
        if (flaggedByConditions && domain === 'Social' && (subdomain === 'Peer Connection' || subdomain === 'Social Inclusion')) {
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
        if (flaggedByConditions && domain === 'General Stress') flags.general_stress_check = true;
        if (flaggedByConditions && domain === 'Strengths') flags.strengths_check = true;
        if (flaggedByConditions && domain === 'Adult Support') flags.adult_support_followup = true;
        if (flaggedByConditions && domain === 'Student Voice') flags.student_voice_followup = true;
        if (flaggedByConditions && domain === 'Future Hope') flags.future_hope_check = true;
        if (flaggedByConditions && domain === 'Adult Trust') flags.adult_trust_check = true;
        if (flaggedByConditions && domain === 'Self-Regulation') flags.self_regulation_check = true;
        if (flaggedByConditions && domain === 'Self-Worth') flags.self_worth_check = true;
        if (flaggedByConditions && domain === 'School Engagement') flags.school_engagement_check = true;
        if (flaggedByConditions && domain === 'Belonging') flags.belonging_check = true;
        if (flaggedByConditions && domain === 'Academic') flags.neurodevelopmental_concerns = true;
    });

    const anyScenarioFlagged = Object.values(flags).some(v => v === true);
    if (!anyScenarioFlagged) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG6P2 = (questions: any[], responsesArray: any[]): MiniFlagsG6P2 => {
    const flags: MiniFlagsG6P2 = {
        exam_stress: false, self_harm: false, family_support: false, sleep_issues: false, bullying: false,
        no_flags_mid_year: false, exam_stress_recheck: false, exam_stress_final_check: false, sleep_recheck: false,
        sleep_final_check: false, family_support_recheck: false, family_support_final: false, self_harm_recheck: false,
        self_harm_crisis_check: false, bullying_check: false,
    };

    questions.forEach((q: any) => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (flagged && (domain === 'Exam Stress' || domain === 'Emotional')) { flags.exam_stress = true; flags.exam_stress_recheck = true; }
        if (domain === 'Sleep' && flagged) { flags.sleep_issues = true; flags.sleep_recheck = true; }
        if (domain === 'Bullying' && flagged) { flags.bullying = true; flags.bullying_check = true; }
        if (domain === 'Family' && flagged) { flags.family_support = true; flags.family_support_recheck = true; }
        if (domain === 'Safety' && flagged) { flags.self_harm = true; flags.self_harm_recheck = true; }
    });

    if (Object.values(flags).every(v => v === false)) flags.no_flags_mid_year = true;
    return flags;
};

export const deriveMiniFlagsForG6P3 = (questions: any[], responsesArray: any[]): MiniFlagsG6P3 => {
    const flags: MiniFlagsG6P3 = {
        bullying_follow_up: false, home_safety_follow_up: false, self_harm_crisis_check: false,
        motivation_burnout_check: false, energy_check: false, family_check: false, general_stress_check: false,
        motivation_check: false, social_check: false, strengths_check: false, no_flags_baseline: false,
    };

    questions.forEach((q: any) => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Safety' && q.subdomain === 'Home Safety' && flagged) flags.home_safety_follow_up = true;
        if (domain === 'Bullying' && flagged) flags.bullying_follow_up = true;
        if (domain === 'Safety' && (q.subdomain === 'Self-Harm' || q.subdomain === 'Self-Harm Ideation') && flagged) flags.self_harm_crisis_check = true;
        if ((domain === 'Motivation' || domain === 'Academic') && flagged) { flags.motivation_burnout_check = true; flags.motivation_check = true; }
        if (domain === 'Energy' && flagged) flags.energy_check = true;
        if (domain === 'Family' && flagged) flags.family_check = true;
        if (domain === 'General Stress' && flagged) flags.general_stress_check = true;
        if (domain === 'Social' && flagged) flags.social_check = true;
        if (domain === 'Strengths' && flagged) flags.strengths_check = true;
    });

    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG7P1 = (questions: any[], responsesArray: any[]): MiniFlagsG7P1 => {
    const flags: MiniFlagsG7P1 = {
        body_image: false, peer_pressure: false, digital_anxiety: false, disengaged: false, academic_confidence_recheck: false,
        belonging_recheck: false, mood_recheck: false, bullying_recheck: false, bullying_followup: false, general_stress_check: false,
        mood_check: false, somatic_check: false, strengths_check: false, support_check: false, adhd_screen_followup: false,
        academic_skills_followup: false, anger_coping_followup: false, cyberbullying_followup: false, emotional_literacy_followup: false,
        girls_health_followup: false, ld_screen_followup: false, memory_strategies_followup: false, romantic_followup: false,
        self_followup: false, self_harm_followup: false, social_media_risk_followup: false, social_media_safety_followup: false,
        substance_detail_followup: false, tech_followup: false, general_social_check: false, social_inclusion_followup: false,
        peer_connection_followup: false, digital_stress_followup: false, mood_loneliness_followup: false,
        academic_confidence_check: false, adult_support_check: false, family_check: false, no_flags_baseline: false,
    };

    questions.forEach((q: any) => {
        const answer = getAnswerByQuestionId(questions, responsesArray, q.id);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (flagged) {
            if (domain === 'ADHD Screen') flags.adhd_screen_followup = true;
            if (domain === 'Academic Skills') flags.academic_skills_followup = true;
            if (domain === 'Anger Coping') flags.anger_coping_followup = true;
            if (domain === 'Bullying') { flags.bullying_followup = true; flags.bullying_recheck = true; }
            if (domain === 'Mood') { flags.mood_check = true; flags.mood_recheck = true; }
            if (domain === 'Self-harm' || domain === 'Self-Harm') flags.self_harm_followup = true;
            // ... more mappings
        }
    });

    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG7P2 = (questions: any[], responsesArray: any[]): MiniFlagsG7P2 => {
    const flags: MiniFlagsG7P2 = {
        exam_stress_check: false, sleep_check: false, family_pressure_check: false, self_harm_followup: false,
        bullying_followup: false, emotional_overwhelm_recheck: false, academic_support_check: false,
        general_stress_check: false, social_check: false, strengths_check: false, no_flags_mid_year: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Exam Stress' && flagged) flags.exam_stress_check = true;
        if (domain === 'Sleep' && flagged) flags.sleep_check = true;
        if (domain === 'Family' && flagged) flags.family_pressure_check = true;
        if (domain === 'Safety' && q.subdomain === 'Self-Harm' && flagged) flags.self_harm_followup = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_mid_year = true;
    return flags;
};

export const deriveMiniFlagsForG7P3 = (questions: any[], responsesArray: any[]): MiniFlagsG7P3 => {
    const flags: MiniFlagsG7P3 = {
        energy_fatigue_check: false, motivation_check: false, coping_check: false, digital_wellbeing_check: false,
        family_support_check: false, bullying_check: false, self_harm_check: false, academic_check: false, social_check: false,
        strengths_check: false, student_voice_check: false, home_safety_check: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (flagged) {
            if (domain === 'Energy') flags.energy_fatigue_check = true;
            if (domain === 'Motivation') flags.motivation_check = true;
            if (domain === 'Safety' && q.subdomain === 'Home Safety') flags.home_safety_check = true;
        }
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG8P1 = (questions: any[], responsesArray: any[]): MiniFlagsG8P1 => {
    const flags: MiniFlagsG8P1 = {
        academic_recheck: false, social_recheck: false, mood_recheck: false, bullying_recheck: false, no_flags_baseline: false,
        peer_susceptibility: false, tech_abuse: false, attention_issues: false, social_media_risk: false, neurodevelopmental: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Academic' && flagged) flags.academic_recheck = true;
        if (domain === 'Social' && flagged) flags.social_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG8P2 = (questions: any[], responsesArray: any[]): MiniFlagsG8P2 => {
    const flags: MiniFlagsG8P2 = {
        exam_stress_recheck: false, sleep_recheck: false, family_pressure_recheck: false, self_harm_followup: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Exam Stress' && flagged) flags.exam_stress_recheck = true;
        if (domain === 'Sleep' && flagged) flags.sleep_recheck = true;
        if (domain === 'Family' && flagged) flags.family_pressure_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG8P3 = (questions: any[], responsesArray: any[]): MiniFlagsG8P3 => {
    const flags: MiniFlagsG8P3 = {
        energy_motivation_recheck: false, academic_engagement_recheck: false, peer_connection_recheck: false, home_safety_recheck: false,
        self_harm_recheck: false, academic_concerns_recheck: false, grade9_anxiety_recheck: false, emotional_concerns_recheck: false,
        support_access_recheck: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Energy' && flagged) flags.energy_motivation_recheck = true;
        if (domain === 'Academic' && flagged) flags.academic_engagement_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG9P1 = (questions: any[], responsesArray: any[]): MiniFlagsG9P1 => {
    const flags: MiniFlagsG9P1 = {
        academic_shock_recheck: false, career_anxiety_recheck: false, sleep_recheck: false, mood_recheck: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Academic' && flagged) flags.academic_shock_recheck = true;
        if (domain === 'Career' && flagged) flags.career_anxiety_recheck = true;
        if (domain === 'Sleep' && flagged) flags.sleep_recheck = true;
        if (domain === 'Mood' && flagged) flags.mood_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG9P2 = (questions: any[], responsesArray: any[]): MiniFlagsG9P2 => {
    const flags: MiniFlagsG9P2 = {
        exam_stress_recheck: false, sleep_recheck: false, mood_recheck: false, family_pressure_recheck: false, self_harm_followup: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Exam Anxiety' && flagged) flags.exam_stress_recheck = true;
        if (domain === 'Sleep' && flagged) flags.sleep_recheck = true;
        if (domain === 'Mood' && flagged) flags.mood_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG9P3 = (questions: any[], responsesArray: any[]): MiniFlagsG9P3 => {
    const flags: MiniFlagsG9P3 = {
        identity_confusion_recheck: false, stream_anxiety_recheck: false, home_safety_recheck: false, self_harm_recheck: false,
        stream_confidence_recheck: false, board_anxiety_recheck: false, emotional_readiness_recheck: false, support_access_recheck: false,
        academic_check: false, bullying_followup: false, digital_wellbeing_check: false, emotional_check: false, family_check: false,
        general_stress_check: false, sleep_check: false, somatic_check: false, strengths_check: false, support_check: false,
        burnout_followup: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Emotional' && flagged) flags.emotional_check = true;
        if (domain === 'Academic' && flagged) flags.academic_check = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG10P1 = (questions: any[], responsesArray: any[]): MiniFlagsG10P1 => {
    const flags: MiniFlagsG10P1 = {
        board_shock_recheck: false, career_worry_recheck: false, time_balance_recheck: false, sleep_recheck: false, mood_recheck: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        const domain = q.domain;
        if (domain === 'Academic' && flagged) flags.board_shock_recheck = true;
        if (domain === 'Career' && flagged) flags.career_worry_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG10P2 = (questions: any[], responsesArray: any[]): MiniFlagsG10P2 => {
    const flags: MiniFlagsG10P2 = {
        academic_confidence_recheck: false, time_balance_recheck: false, sleep_recheck: false, family_pressure_recheck: false, self_harm_followup: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        if (q.domain === 'Exam Anxiety' && flagged) flags.academic_confidence_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const deriveMiniFlagsForG10P3 = (questions: any[], responsesArray: any[]): MiniFlagsG10P3 => {
    const flags: MiniFlagsG10P3 = {
        physical_health_recheck: false, academic_confidence_recheck: false, coping_skills_recheck: false, family_support_recheck: false,
        self_harm_recheck: false, exam_anxiety_recheck: false, support_access_recheck: false, no_flags_baseline: false,
    };
    questions.forEach(q => {
        const answer = getAnswerForQuestion(questions, responsesArray, q);
        if (answer == null) return;
        const flagged = isQuestionFlaggedByConditions(q, answer);
        if (q.domain === 'Sleep' && flagged) flags.physical_health_recheck = true;
    });
    if (Object.values(flags).every(v => v === false)) flags.no_flags_baseline = true;
    return flags;
};

export const FLAG_DERIVER_FUNCTIONS: Record<string, (questions: any[], responses: any[]) => any> = {
    deriveMiniFlagsForG6P1,
    deriveMiniFlagsForG6P2,
    deriveMiniFlagsForG6P3,
    deriveMiniFlagsForG7P1,
    deriveMiniFlagsForG7P2,
    deriveMiniFlagsForG7P3,
    deriveMiniFlagsForG8P1,
    deriveMiniFlagsForG8P2,
    deriveMiniFlagsForG8P3,
    deriveMiniFlagsForG9P1,
    deriveMiniFlagsForG9P2,
    deriveMiniFlagsForG9P3,
    deriveMiniFlagsForG10P1,
    deriveMiniFlagsForG10P2,
    deriveMiniFlagsForG10P3,
};
