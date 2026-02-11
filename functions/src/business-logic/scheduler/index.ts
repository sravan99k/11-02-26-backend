import { scheduleMiniForUser } from "@/services/miniAssessmentService";
import { loadEnabledAssessments } from "@/services/assessmentManagementService";
import { deriveFlagsSafely } from "@/services/assessmentUtils";
import { FLOW_CONFIG } from "./configs";
import { FlagDeriver } from "./types";

// Generic scheduler that uses FLOW_CONFIG and flag derivation functions.
// To support a new grade/phase, add a config entry and a flag-deriver;
// the engine logic below does not need to change.
export async function scheduleNextMiniAssessment(
    userId: string,
    grade: number,
    phase: number,
    majorQuestions: any[],
    responsesArray: any[],
    flagDerivationFunctions: Record<string, Function>
): Promise<void> {
    try {
        const flowKey = `g${grade}-p${phase}`;
        const config = FLOW_CONFIG[flowKey];

        if (!config) {
            console.warn("[assessmentScheduler] No FLOW_CONFIG defined for", { grade, phase });
            return;
        }


        const deriveFlags = flagDerivationFunctions[config.flagDeriverKey] as FlagDeriver | undefined;
        if (typeof deriveFlags !== "function") {
            console.warn("[assessmentScheduler] No flag deriver found for", {
                grade,
                phase,
                flagDeriverKey: config.flagDeriverKey,
            });
            return;
        }

        // Derive flags with error handling - if derivation fails, use a sentinel flag
        const flags = deriveFlagsSafely(
            deriveFlags,
            majorQuestions,
            responsesArray,
            { __derivation_failed__: true } as any
        );

        // If flag derivation failed, do NOT schedule any mini to avoid misclassifying students as baseline
        if ((flags as any).__derivation_failed__) {
            console.warn("[assessmentScheduler] Flag derivation failed; skipping mini scheduling for", {
                grade,
                phase,
            });
            return;
        }
        const enabled = await loadEnabledAssessments();
        console.log('[assessmentScheduler] Loaded enabled config:', enabled);

        const isAssessmentEnabled = (assessmentId: string): boolean => {
            if (!enabled) {
                console.warn('[assessmentScheduler] No enabled config found');
                return false;
            }
            const result = Boolean(enabled[assessmentId]);
            console.log(`[assessmentScheduler] Checking enabled[${assessmentId}] = ${enabled[assessmentId]} => ${result}`);
            return result;
        };

        // Pick the first mini whose condition is satisfied and is enabled in admin
        console.log("[assessmentScheduler] Evaluating minis for", { grade, phase, flags });

        const chosenMini = config.minis.find((mini) => {
            const conditionMet = mini.when(flags);
            const enabledStatus = isAssessmentEnabled(mini.assessmentId);
            console.log(`[assessmentScheduler] Checking mini ${mini.assessmentId}: conditionMet=${conditionMet}, enabled=${enabledStatus}`);
            return conditionMet && enabledStatus;
        });

        if (!chosenMini) {
            console.log("[assessmentScheduler] No eligible mini found for", {
                grade,
                phase,
                flags,
                satisfiedButDisabled: config.minis.filter(m => m.when(flags)).map(m => m.assessmentId)
            });
            return;
        }

        let nextMiniPayload: {
            assessmentId: string;
            fileKey: string;
            flags?: Record<string, boolean>;
        } | undefined;

        if (
            chosenMini.nextMiniId &&
            (!chosenMini.nextMiniCondition || chosenMini.nextMiniCondition(flags)) &&
            isAssessmentEnabled(chosenMini.nextMiniId)
        ) {
            nextMiniPayload = {
                assessmentId: chosenMini.nextMiniId,
                fileKey:
                    config.minis.find((m) => m.assessmentId === chosenMini.nextMiniId)?.fileKey ||
                    chosenMini.nextMiniId,
                ...(chosenMini.nextMiniProjectFlags
                    ? { flags: chosenMini.nextMiniProjectFlags(flags) }
                    : {}),
            };
        }

        await scheduleMiniForUser(userId, {
            grade,
            phase,
            assessmentId: chosenMini.assessmentId,
            fromAssessmentId: chosenMini.fromAssessmentId,
            fileKey: chosenMini.fileKey,
            ...(chosenMini.projectFlags ? { flags: chosenMini.projectFlags(flags) } : {}),
            ...(nextMiniPayload ? { nextMini: nextMiniPayload } : {}),
            status: "scheduled",
        });
    } catch (err) {
        console.error("[assessmentScheduler] Failed to schedule next mini assessment", { userId, grade, phase }, err);
    }
}
