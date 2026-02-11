/**
 * Grade 8 Phase 1 Flag Deriver
 * 
 * Derives flags for Grade 8, Phase 1 Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions, getNumericValueForQuestionAnswer } from '../../flagEngine';
import type { MiniFlagsG8P1 } from '../types';

/**
 * Derives Mini flags for Grade 8 Phase 1 based on Major assessment responses.
 * 
 * Uses domain-driven pattern to detect transition difficulties, social vulnerabilities,
 * neurodevelopmental concerns, and technology-related risks (peer susceptibility,
 * tech abuse, attention issues, social media risk).
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG8P1 = (questions: any[], responsesArray: any[]): MiniFlagsG8P1 => {
    const flags: MiniFlagsG8P1 = {
        academic_recheck: false,
        social_recheck: false,
        mood_recheck: false,
        bullying_recheck: false,
        no_flags_baseline: false,
        peer_susceptibility: false,
        tech_abuse: false,
        attention_issues: false,
        social_media_risk: false,
        neurodevelopmental: false,
    };

    // Create response map for O(1) lookups
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

        // General Rechecks
        if (
            domain === 'Academic' &&
            (subdomain === 'Difficulty Transition' || subdomain === 'Academic Confidence') &&
            (flagged || (numeric != null && numeric >= 4))
        ) {
            flags.academic_recheck = true;
            // Map to attention_issues if academic confidence is low
            if (subdomain === 'Difficulty Transition') {
                flags.attention_issues = true;
            }
        }

        if (
            domain === 'Social' &&
            (subdomain === 'Inclusion' || subdomain === 'Peer Connection') &&
            (flagged || (numeric != null && numeric >= 4))
        ) {
            flags.social_recheck = true;
            // Map to Peer Susceptibility if social issues present
            flags.peer_susceptibility = true;
        }

        if (
            domain === 'Emotional' &&
            subdomain === 'Depression Screening' &&
            flagged
        ) {
            flags.mood_recheck = true;
        }

        if (domain === 'Bullying' && flagged) {
            flags.bullying_recheck = true;
            // Map Cyberbullying to Social Media Risk
            if (subdomain === 'Cyberbullying') {
                flags.social_media_risk = true;
                flags.tech_abuse = true;
            }
        }

        // Neurodevelopmental concerns from cognitive/learning domains
        if (
            (domain === 'Auditory Processing' && flagged) ||
            (domain === 'Learning Disability' && flagged) ||
            (domain === 'Memory Processing' && flagged) ||
            (domain === 'Working Memory' && flagged) ||
            (domain === 'Physical Disability' && flagged)
        ) {
            flags.neurodevelopmental = true;
        }
    });

    // Use hasAnyFlags helper instead of manual enumeration
    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
