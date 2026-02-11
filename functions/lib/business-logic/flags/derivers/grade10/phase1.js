"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveMiniFlagsForG10P1 = void 0;
const assessmentUtils_1 = require("../../assessmentUtils");
const flagEngine_1 = require("../../flagEngine");
const deriveMiniFlagsForG10P1 = (questions, responsesArray) => {
    const flags = {
        board_shock_recheck: false,
        career_worry_recheck: false,
        time_balance_recheck: false,
        sleep_recheck: false,
        mood_recheck: false,
        no_flags_baseline: false,
    };
    const responseMap = (0, assessmentUtils_1.createResponseMap)(responsesArray);
    questions.forEach((q) => {
        const answer = (0, assessmentUtils_1.getAnswerFromMap)(q, questions, responseMap);
        if (answer == null) {
            return;
        }
        const domain = q.domain;
        const subdomain = q.subdomain;
        const flagged = (0, flagEngine_1.isQuestionFlaggedByConditions)(q, answer);
        const numeric = (0, flagEngine_1.getNumericValueForQuestionAnswer)(q, answer);
        if (domain === 'Academic' && subdomain === 'Board Shock' && flagged) {
            flags.board_shock_recheck = true;
        }
        if (domain === 'Career' && subdomain === 'After Grade 10 Anxiety' && flagged) {
            flags.career_worry_recheck = true;
        }
        if (domain === 'Time Management' &&
            subdomain === 'Executive Function' &&
            (flagged || (numeric != null && numeric >= 3))) {
            flags.time_balance_recheck = true;
        }
        if ((domain === 'Sleep' && subdomain === 'Sleep Quality' && flagged) ||
            (domain === 'Digital Well-being' && subdomain === 'Escape Behavior' && flagged)) {
            flags.sleep_recheck = true;
        }
        if (domain === 'Mood' && subdomain === 'Depression Screening' && flagged) {
            flags.mood_recheck = true;
        }
    });
    flags.no_flags_baseline = !(0, assessmentUtils_1.hasAnyFlags)(flags);
    return flags;
};
exports.deriveMiniFlagsForG10P1 = deriveMiniFlagsForG10P1;
//# sourceMappingURL=phase1.js.map