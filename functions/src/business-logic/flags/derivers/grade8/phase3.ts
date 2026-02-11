/**
 * Grade 8 Phase 3 Flag Deriver
 * 
 * Derives flags for Grade 8, Phase 3 (Final) Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions, getNumericValueForQuestionAnswer } from '../../flagEngine';
import type { MiniFlagsG8P3 } from '../types';

/**
 * Derives Mini flags for Grade 8 Phase 3 based on Major assessment responses.
 * 
 * Focuses on end-of-year and transition concerns: energy/motivation, academic engagement,
 * peer connections, home safety, self-harm, Grade 9 anxiety, emotional wellbeing,
 * and support access.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG8P3 = (questions: any[], responsesArray: any[]): MiniFlagsG8P3 => {
    const flags: MiniFlagsG8P3 = {
        energy_motivation_recheck: false,
        academic_engagement_recheck: false,
        peer_connection_recheck: false,
        home_safety_recheck: false,
        self_harm_recheck: false,
        academic_concerns_recheck: false,
        grade9_anxiety_recheck: false,
        emotional_concerns_recheck: false,
        support_access_recheck: false,
        safety_followup: false,
        no_flags_baseline: false,
    };

    const responseMap = createResponseMap(responsesArray);

    questions.forEach((q: any) => {
        const answer = getAnswerFromMap(q, questions, responseMap);
        if (answer == null) {
            return;
        }

        const domain = q.domain as string | undefined;
        const subdomain = q.subdomain as string | undefined;

        const flagged = isQuestionFlaggedByConditions(q, answer);
        const numeric = getNumericValueForQuestionAnswer(q, answer);

        // Energy & motivation risk
        if (
            (domain === 'Energy' && flagged) ||
            (domain === 'Motivation' && (flagged || (numeric != null && numeric <= 2)))
        ) {
            flags.energy_motivation_recheck = true;
            flags.academic_concerns_recheck = true;
        }

        // Academic engagement risk
        if (domain === 'Academic' && subdomain === 'Engagement' && flagged) {
            flags.academic_engagement_recheck = true;
            flags.academic_concerns_recheck = true;
        }

        // Peer connection / isolation risk
        if (domain === 'Social' && subdomain === 'Connection/Isolation' && flagged) {
            flags.peer_connection_recheck = true;
        }

        // Mood / emotional concerns
        if (domain === 'Emotional' && subdomain === 'Mood' && flagged) {
            flags.emotional_concerns_recheck = true;
        }

        // Hopelessness / Grade 9 anxiety
        if (domain === 'Emotional' && subdomain === 'Hopelessness Screening' && flagged) {
            flags.grade9_anxiety_recheck = true;
            flags.emotional_concerns_recheck = true;
        }

        // Home safety
        if (domain === 'Safety' && subdomain === 'Home Safety' && flagged) {
            flags.home_safety_recheck = true;
            flags.safety_followup = true;
        }

        // Self-harm safety
        if (domain === 'Safety' && subdomain === 'Self-Harm' && flagged) {
            flags.self_harm_recheck = true;
            flags.safety_followup = true;
        }

        // Support access
        if (
            domain === 'Support' &&
            (flagged || (numeric != null && numeric >= 4))
        ) {
            flags.support_access_recheck = true;
        }
    });

    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
