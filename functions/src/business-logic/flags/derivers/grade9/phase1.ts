/**
 * Grade 9 Phase 1 Flag Deriver
 * 
 * Derives flags for Grade 9, Phase 1 Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions, getNumericValueForQuestionAnswer } from '../../flagEngine';
import type { MiniFlagsG9P1 } from '../types';

/**
 * Derives Mini flags for Grade 9 Phase 1 based on Major assessment responses.
 * 
 * Focuses on Grade 9 transition challenges: academic shock from increased workload,
 * career/stream anxiety, sleep disruption, and mood concerns.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG9P1 = (questions: any[], responsesArray: any[]): MiniFlagsG9P1 => {
    const flags: MiniFlagsG9P1 = {
        academic_shock_recheck: false,
        career_anxiety_recheck: false,
        sleep_recheck: false,
        mood_recheck: false,
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

        // Academic shock and low confidence
        if (
            (domain === 'Academic' && subdomain === 'Academic Shock' && flagged) ||
            (domain === 'Academic' && subdomain === 'Academic Confidence' && (flagged || (numeric != null && numeric >= 4)))
        ) {
            flags.academic_shock_recheck = true;
        }

        // Career / stream anxiety
        if (domain === 'Career' && subdomain === 'Stream Anxiety' && flagged) {
            flags.career_anxiety_recheck = true;
        }

        // Sleep reduction
        if (domain === 'Sleep' && subdomain === 'Sleep Quality' && flagged) {
            flags.sleep_recheck = true;
        }

        // Mood / depression
        if (domain === 'Mood' && subdomain === 'Depression Screening' && flagged) {
            flags.mood_recheck = true;
        }
    });

    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
