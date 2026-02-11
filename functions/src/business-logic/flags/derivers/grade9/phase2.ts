/**
 * Grade 9 Phase 2 Flag Deriver
 * 
 * Derives flags for Grade 9, Phase 2 (Mid-Year) Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions, getNumericValueForQuestionAnswer } from '../../flagEngine';
import type { MiniFlagsG9P2 } from '../types';

/**
 * Derives Mini flags for Grade 9 Phase 2 based on Major assessment responses.
 * 
 * Focuses on mid-year board exam pressures: exam anxiety, late-night studying affecting
 * sleep, mood/self-worth impacts, family pressure/fear of reaction, and self-harm.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG9P2 = (questions: any[], responsesArray: any[]): MiniFlagsG9P2 => {
    const flags: MiniFlagsG9P2 = {
        exam_stress_recheck: false,
        sleep_recheck: false,
        mood_recheck: false,
        family_pressure_recheck: false,
        self_harm_followup: false,
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

        // Exam stress: forgetting in front of paper, panic/overwhelm
        if (
            (domain === 'Exam Anxiety' && subdomain === 'Forgetting' && flagged) ||
            (domain === 'Emotional' && subdomain === 'Panic/Overwhelm' && flagged)
        ) {
            flags.exam_stress_recheck = true;
        }

        // Sleep / late-night study contributing to fatigue
        if (
            domain === 'Academic' &&
            subdomain === 'Late-night Study' &&
            (flagged || (numeric != null && numeric >= 3))
        ) {
            flags.sleep_recheck = true;
        }

        // Mood / self-worth and somatic symptoms
        if (
            (domain === 'Emotional' && subdomain === 'Self-Worth' && flagged) ||
            (domain === 'Somatic' && subdomain === 'Physical Symptoms' && flagged)
        ) {
            flags.mood_recheck = true;
        }

        // Family pressure/fear of reaction
        if (domain === 'Family' && subdomain === 'Fear of Reaction' && flagged) {
            flags.family_pressure_recheck = true;
        }

        // Self-harm safety
        if (domain === 'Safety' && subdomain === 'Self-Harm' && flagged) {
            flags.self_harm_followup = true;
        }
    });

    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
