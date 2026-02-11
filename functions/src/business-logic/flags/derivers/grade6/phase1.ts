/**
 * Grade 6 Phase 1 Flag Deriver
 * 
 * Derives flags for Grade 6, Phase 1 Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions } from '../../flagEngine';
import type { MiniFlagsG6P1 } from '../types';

/**
 * Derives Mini flags for Grade 6 Phase 1 based on Major assessment responses.
 * 
 * Uses domain-driven pattern to map question domains/subdomains to specific flags.
 * Optimized with O(1) response lookups via createResponseMap.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG6P1 = (questions: any[], responsesArray: any[]): MiniFlagsG6P1 => {
    const flags: MiniFlagsG6P1 = {
        academic_anxiety: false,
        social_isolation: false,
        neurodevelopmental_concerns: false,
        trauma_exposure: false,
        academic_anxiety_recheck: false,
        social_isolation_recheck: false,
        mood_concerns_recheck: false,
        bullying_recheck: false,
        bullying_followup: false,
        general_stress_check: false,
        mood_check: false,
        strengths_check: false,
        adult_support_followup: false,
        student_voice_followup: false,
        future_hope_check: false,
        adult_trust_check: false,
        self_regulation_check: false,
        self_worth_check: false,
        school_engagement_check: false,
        belonging_check: false,
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

        const flaggedByConditions = isQuestionFlaggedByConditions(q, answer);

        // Academic anxiety: academic adjustment/anxiety questions that meet their flagConditions
        if (
            flaggedByConditions &&
            domain === 'Academic' &&
            (subdomain === 'Academic Adjustment' || subdomain === 'Academic Anxiety')
        ) {
            flags.academic_anxiety = true;
            flags.academic_anxiety_recheck = true;
        }

        // Social isolation: low peer connection / social inclusion
        if (
            flaggedByConditions &&
            domain === 'Social' &&
            (subdomain === 'Peer Connection' || subdomain === 'Social Inclusion')
        ) {
            flags.social_isolation = true;
            flags.social_isolation_recheck = true;
        }

        // Mood concerns check
        if (flaggedByConditions && domain === 'Mood') {
            flags.mood_concerns_recheck = true;
            flags.mood_check = true;
        }

        // Bullying / trauma exposure from explicit bullying-domain flags
        if (flaggedByConditions && domain === 'Bullying') {
            flags.trauma_exposure = true;
            flags.bullying_recheck = true;
            flags.bullying_followup = true;
        }





        // Adult Support
        if (flaggedByConditions && domain === 'Adult Support') {
            flags.adult_support_followup = true;
        }



        // Future Hope
        if (flaggedByConditions && domain === 'Future Hope') {
            flags.future_hope_check = true;
        }

        // Adult Trust
        if (flaggedByConditions && domain === 'Adult Trust') {
            flags.adult_trust_check = true;
        }

        // Self-Regulation
        if (flaggedByConditions && domain === 'Self-Regulation') {
            flags.self_regulation_check = true;
        }

        // Self-Worth
        if (flaggedByConditions && domain === 'Self-Worth') {
            flags.self_worth_check = true;
        }

        // School Engagement
        if (flaggedByConditions && domain === 'School Engagement') {
            flags.school_engagement_check = true;
        }

        // Belonging
        if (flaggedByConditions && domain === 'Belonging') {
            flags.belonging_check = true;
        }

        // Neurodevelopmental concerns: Academic domain flags (attention, learning difficulties)
        // Note: G6P1 major doesn't have specific neurodevelopmental subdomains,
        // so we map any flagged Academic domain to neurodevelopmental_concerns
        // This follows Option C approach: map to general academic/attention domains
        if (flaggedByConditions && domain === 'Academic') {
            flags.neurodevelopmental_concerns = true;
        }


    });

    // Set baseline flag if no scenarios are triggered
    flags.no_flags_baseline = !hasAnyFlags(flags);

    return flags;
};
