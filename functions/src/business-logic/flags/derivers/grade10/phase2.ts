/**
 * Grade 10 Phase 2 Flag Deriver
 * 
 * Derives flags for Grade 10, Phase 2 (Mid-Year) Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions } from '../../flagEngine';
import type { MiniFlagsG10P2 } from '../types';

/**
 * Derives Mini flags for Grade 10 Phase 2 based on Major assessment responses.
 * 
 * Focuses on peak board exam pressures: academic confidence/exam anxiety,
 * time balance from late-night studying, sleep/somatic stress, family pressure,
 * and self-harm concerns.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG10P2 = (questions: any[], responsesArray: any[]): MiniFlagsG10P2 => {
    const flags: MiniFlagsG10P2 = {
        academic_confidence_recheck: false,
        time_balance_recheck: false,
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

        // Academic confidence and exam worry
        if (
            (domain === 'Exam Anxiety' && subdomain === 'Exam Stress' && flagged) ||
            (domain === 'Academic' && subdomain === 'Recall' && flagged)
        ) {
            flags.academic_confidence_recheck = true;
        }

        // Time balance via late-night study
        if (domain === 'Academic' && subdomain === 'Late-Night' && flagged) {
            flags.time_balance_recheck = true;
            flags.sleep_recheck = true;
        }

        // Sleep/physical stress
        if (domain === 'Somatic' && subdomain === 'Somatic Stress' && flagged) {
            flags.sleep_recheck = true;
        }

        // Family pressure/fear of disappointment
        if (domain === 'Family' && subdomain === 'Fear of Disappointment' && flagged) {
            flags.family_pressure_recheck = true;
        }

        // Self-harm follow-up
        if (domain === 'Safety' && subdomain === 'Self-Harm' && flagged) {
            flags.self_harm_followup = true;
        }
    });

    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
