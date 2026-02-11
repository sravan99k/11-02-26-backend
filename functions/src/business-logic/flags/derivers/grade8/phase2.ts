/**
 * Grade 8 Phase 2 Flag Deriver
 * 
 * Derives flags for Grade 8, Phase 2 (Mid-Year) Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions, getNumericValueForQuestionAnswer } from '../../flagEngine';
import type { MiniFlagsG8P2 } from '../types';

/**
 * Derives Mini flags for Grade 8 Phase 2 based on Major assessment responses.
 * 
 * Focuses on mid-year pressures: exam stress, sleep  quality, family pressure/expectations,
 * and self-harm concerns.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG8P2 = (questions: any[], responsesArray: any[]): MiniFlagsG8P2 => {
    const flags: MiniFlagsG8P2 = {
        exam_stress_recheck: false,
        sleep_recheck: false,
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

        if (
            (domain === 'Exam Stress' && flagged) ||
            (domain === 'Academic' &&
                subdomain === 'Recall Confidence' &&
                (flagged || (numeric != null && numeric <= 2)))
        ) {
            flags.exam_stress_recheck = true;
        }

        if (domain === 'Sleep' && flagged) {
            flags.sleep_recheck = true;
        }

        if (
            domain === 'Family' &&
            (subdomain === 'Pressure/Comparison' || subdomain === 'Expectation Stress') &&
            (flagged || (numeric != null && numeric >= 3))
        ) {
            flags.family_pressure_recheck = true;
        }

        if (
            domain === 'Safety' &&
            subdomain === 'Self-Harm' &&
            flagged
        ) {
            flags.self_harm_followup = true;
        }
    });

    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
