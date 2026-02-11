/**
 * Grade 6 Phase 2 Flag Deriver
 * 
 * Derives flags for Grade 6, Phase 2 (Mid-Year) Major assessment to determine
 * which Mini assessment scenarios should be triggered.
 */

import { createResponseMap, getAnswerFromMap, hasAnyFlags } from '../../assessmentUtils';
import { isQuestionFlaggedByConditions, getNumericValueForQuestionAnswer } from '../../flagEngine';
import type { MiniFlagsG6P2 } from '../types';

/**
 * Derives Mini flags for Grade 6 Phase 2 based on Major assessment responses.
 * 
 * Focuses on mid-year stressors: exam stress, sleep issues, family support,
 * self-harm ideation, and bullying concerns.
 * 
 * @param questions - Array of Major assessment questions
 * @param responsesArray - Array of student responses
 * @returns Flag set indicating which Mini assessment scenarios to trigger
 */
export const deriveMiniFlagsForG6P2 = (questions: any[], responsesArray: any[]): MiniFlagsG6P2 => {
    const flags: MiniFlagsG6P2 = {
        exam_stress: false,
        self_harm: false,
        family_support: false,
        sleep_issues: false,
        bullying: false,
        no_flags_mid_year: false,
        exam_stress_recheck: false,
        exam_stress_final_check: false,
        sleep_recheck: false,
        sleep_final_check: false,
        family_support_recheck: false,
        family_support_final: false,
        self_harm_recheck: false,
        self_harm_crisis_check: false,
        bullying_check: false,
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

        // Exam stress from exam-stress and emotional-overwhelm domains
        if (
            flagged &&
            (
                domain === 'Exam Stress' ||
                (domain === 'Emotional' && (subdomain === 'Anxiety' || subdomain === 'Overwhelm'))
            )
        ) {
            flags.exam_stress = true;
            flags.exam_stress_recheck = true;
            flags.exam_stress_final_check = true;
        }

        // Sleep issues from Sleep domain
        if (domain === 'Sleep' && flagged) {
            flags.sleep_issues = true;
            flags.sleep_recheck = true;
            flags.sleep_final_check = true;
        }

        // Bullying from Bullying domain
        if (domain === 'Bullying' && flagged) {
            flags.bullying = true;
            flags.bullying_check = true;
        }

        // Family support risk from Family / Family Support domain
        if (
            domain === 'Family' &&
            subdomain === 'Family Support' &&
            (flagged || (numeric != null && numeric <= 2))
        ) {
            flags.family_support = true;
            flags.family_support_recheck = true;
            flags.family_support_final = true;
        }

        // Self-harm ideation from Safety / Self-Harm Ideation
        if (
            domain === 'Safety' &&
            subdomain === 'Self-Harm Ideation' &&
            flagged
        ) {
            flags.self_harm = true;
            flags.self_harm_recheck = true;
            flags.self_harm_crisis_check = true;
        }

        // Optional: text-analysis based crisis language in exam-stress open question


        // Missing domains added based on audit:
        // Academic Support domain (no subdomain in JSON)
        if (domain === 'Academic Support' && flagged) {
            flags.exam_stress = true; // Map to exam_stress as academic support needs relate to exam preparation
        }

        // Social domain with Peer Connection subdomain
        if (
            domain === 'Social' &&
            subdomain === 'Peer Connection' &&
            flagged
        ) {
            flags.bullying = true; // Social/peer issues may relate to bullying/isolation
        }

        // Strengths domain (no subdomain in JSON)
        if (domain === 'Strengths' && flagged) {
            flags.exam_stress = true; // Lack of strengths/low self-concept may contribute to exam stress
        }

        // Support domain with Support Needs subdomain
        if (
            domain === 'Support' &&
            subdomain === 'Support Needs' &&
            flagged
        ) {
            flags.family_support = true; // Map Support/Support Needs to family_support
        }
    });

    if (
        !flags.exam_stress &&
        !flags.self_harm &&
        !flags.family_support &&
        !flags.sleep_issues &&
        !flags.bullying
    ) {
        flags.no_flags_mid_year = true;
    }

    return flags;
};
