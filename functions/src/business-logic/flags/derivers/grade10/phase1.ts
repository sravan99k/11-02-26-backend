/**
 * Grade 10 Phase 1 Flag Deriver
 * 
 * Derives flags for Grade 10, Phase 1 Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions, getNumericValueForQuestionAnswer } from '../../flagEngine';
import type { MiniFlagsG10P1 } from '../types';

/**
 * Derives Mini flags for Grade 10 Phase 1 based on Major assessment responses.
 * 
 * Focuses on board exam shock, career anxiety about post-Grade 10 paths,
 * time management/executive function, sleep quality, and mood concerns.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG10P1 = (questions: any[], responsesArray: any[]): MiniFlagsG10P1 => {
    const flags: MiniFlagsG10P1 = {
        board_shock_recheck: false,
        career_worry_recheck: false,
        time_balance_recheck: false,
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

        // Board academic shock
        if (domain === 'Academic' && subdomain === 'Board Shock' && flagged) {
            flags.board_shock_recheck = true;
        }

        // Career worry after Grade 10
        if (domain === 'Career' && subdomain === 'After Grade 10 Anxiety' && flagged) {
            flags.career_worry_recheck = true;
        }

        // Time balance / executive function
        if (
            domain === 'Time Management' &&
            subdomain === 'Executive Function' &&
            (flagged || (numeric != null && numeric >= 3))
        ) {
            flags.time_balance_recheck = true;
        }

        // Sleep quality and digital late-night use
        if (
            (domain === 'Sleep' && subdomain === 'Sleep Quality' && flagged) ||
            (domain === 'Digital Well-being' && subdomain === 'Escape Behavior' && flagged)
        ) {
            flags.sleep_recheck = true;
        }

        // Mood / depression screening
        if (domain === 'Mood' && subdomain === 'Depression Screening' && flagged) {
            flags.mood_recheck = true;
        }
    });

    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
