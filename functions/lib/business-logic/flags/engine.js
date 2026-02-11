"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isQuestionFlaggedByConditions = exports.getNumericValueForQuestionAnswer = void 0;
const getNumericValueForQuestionAnswer = (question, answer) => {
    if (!question || !question.responseOptions)
        return null;
    const opts = question.responseOptions;
    const scale = Array.isArray(opts.scale) ? opts.scale : (Array.isArray(opts.options) ? opts.options : null);
    const values = Array.isArray(opts.values) ? opts.values : null;
    if (!scale || !values || scale.length !== values.length) {
        return null;
    }
    if (typeof answer !== 'string')
        return null;
    const idx = scale.indexOf(answer);
    if (idx === -1)
        return null;
    const value = values[idx];
    return typeof value === 'number' ? value : null;
};
exports.getNumericValueForQuestionAnswer = getNumericValueForQuestionAnswer;
const isQuestionFlaggedByConditions = (question, answer) => {
    const conditions = question === null || question === void 0 ? void 0 : question.flagConditions;
    if (!conditions || typeof conditions !== 'object')
        return false;
    const entries = Object.entries(conditions).filter(([, v]) => typeof v === 'string');
    if (!entries.length)
        return false;
    const numericValue = (0, exports.getNumericValueForQuestionAnswer)(question, answer);
    const compare = (a, op, b) => {
        switch (op) {
            case '>':
                return a > b;
            case '>=':
                return a >= b;
            case '<':
                return a < b;
            case '<=':
                return a <= b;
            case '==':
            case '=':
                return a === b;
            default:
                return false;
        }
    };
    return entries.some(([, cond]) => {
        const minLengthMatch = cond.match(/^minLength:(\d+)$/);
        if (minLengthMatch) {
            if (typeof answer !== 'string')
                return false;
            return answer.length >= parseInt(minLengthMatch[1], 10);
        }
        const match = cond.match(/^(>=|<=|>|<|==|=)\s*(\d+(?:\.\d+)?)$/);
        if (match) {
            if (numericValue == null)
                return false;
            const op = match[1];
            const threshold = parseFloat(match[2]);
            return compare(numericValue, op, threshold);
        }
        if (typeof answer === 'string') {
            return answer === cond;
        }
        return false;
    });
};
exports.isQuestionFlaggedByConditions = isQuestionFlaggedByConditions;
//# sourceMappingURL=engine.js.map