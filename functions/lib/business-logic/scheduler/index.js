"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleNextMiniAssessment = scheduleNextMiniAssessment;
const miniAssessmentService_1 = require("@/services/miniAssessmentService");
const assessmentManagementService_1 = require("@/services/assessmentManagementService");
const assessmentUtils_1 = require("@/services/assessmentUtils");
const configs_1 = require("./configs");
async function scheduleNextMiniAssessment(userId, grade, phase, majorQuestions, responsesArray, flagDerivationFunctions) {
    var _a;
    try {
        const flowKey = `g${grade}-p${phase}`;
        const config = configs_1.FLOW_CONFIG[flowKey];
        if (!config) {
            console.warn("[assessmentScheduler] No FLOW_CONFIG defined for", { grade, phase });
            return;
        }
        const deriveFlags = flagDerivationFunctions[config.flagDeriverKey];
        if (typeof deriveFlags !== "function") {
            console.warn("[assessmentScheduler] No flag deriver found for", {
                grade,
                phase,
                flagDeriverKey: config.flagDeriverKey,
            });
            return;
        }
        const flags = (0, assessmentUtils_1.deriveFlagsSafely)(deriveFlags, majorQuestions, responsesArray, { __derivation_failed__: true });
        if (flags.__derivation_failed__) {
            console.warn("[assessmentScheduler] Flag derivation failed; skipping mini scheduling for", {
                grade,
                phase,
            });
            return;
        }
        const enabled = await (0, assessmentManagementService_1.loadEnabledAssessments)();
        console.log('[assessmentScheduler] Loaded enabled config:', enabled);
        const isAssessmentEnabled = (assessmentId) => {
            if (!enabled) {
                console.warn('[assessmentScheduler] No enabled config found');
                return false;
            }
            const result = Boolean(enabled[assessmentId]);
            console.log(`[assessmentScheduler] Checking enabled[${assessmentId}] = ${enabled[assessmentId]} => ${result}`);
            return result;
        };
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
        let nextMiniPayload;
        if (chosenMini.nextMiniId &&
            (!chosenMini.nextMiniCondition || chosenMini.nextMiniCondition(flags)) &&
            isAssessmentEnabled(chosenMini.nextMiniId)) {
            nextMiniPayload = {
                assessmentId: chosenMini.nextMiniId,
                fileKey: ((_a = config.minis.find((m) => m.assessmentId === chosenMini.nextMiniId)) === null || _a === void 0 ? void 0 : _a.fileKey) ||
                    chosenMini.nextMiniId,
                ...(chosenMini.nextMiniProjectFlags
                    ? { flags: chosenMini.nextMiniProjectFlags(flags) }
                    : {}),
            };
        }
        await (0, miniAssessmentService_1.scheduleMiniForUser)(userId, {
            grade,
            phase,
            assessmentId: chosenMini.assessmentId,
            fromAssessmentId: chosenMini.fromAssessmentId,
            fileKey: chosenMini.fileKey,
            ...(chosenMini.projectFlags ? { flags: chosenMini.projectFlags(flags) } : {}),
            ...(nextMiniPayload ? { nextMini: nextMiniPayload } : {}),
            status: "scheduled",
        });
    }
    catch (err) {
        console.error("[assessmentScheduler] Failed to schedule next mini assessment", { userId, grade, phase }, err);
    }
}
//# sourceMappingURL=index.js.map