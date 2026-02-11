"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReverseScoredQuestion = exports.optionScores = exports.deriveFlagsSafely = exports.createQuestionMap = exports.getDefaultFlags = exports.hasAnyFlags = exports.getAnswerForQuestion = exports.getAnswerFromMap = exports.createResponseMap = void 0;
const createResponseMap = (responsesArray) => {
    const map = new Map();
    if (!Array.isArray(responsesArray)) {
        console.warn('createResponseMap: Invalid responsesArray, expected array');
        return map;
    }
    responsesArray.forEach((resp) => {
        if (resp && typeof resp.questionIndex === 'number') {
            map.set(resp.questionIndex, resp.answer);
        }
    });
    return map;
};
exports.createResponseMap = createResponseMap;
const getAnswerFromMap = (question, questions, responseMap) => {
    if (!question) {
        return null;
    }
    let index;
    if (typeof question.questionNumber === 'number') {
        index = question.questionNumber - 1;
    }
    else {
        index = questions.indexOf(question);
    }
    if (index < 0) {
        return null;
    }
    const answer = responseMap.get(index);
    return answer !== undefined ? answer : null;
};
exports.getAnswerFromMap = getAnswerFromMap;
const getAnswerForQuestion = (question, questions, responsesArray) => {
    if (!question) {
        return null;
    }
    let index;
    if (typeof question.questionNumber === 'number') {
        index = question.questionNumber - 1;
    }
    else {
        index = questions.indexOf(question);
    }
    if (index < 0) {
        return null;
    }
    const resp = responsesArray.find((r) => r.questionIndex === index);
    return resp ? resp.answer : null;
};
exports.getAnswerForQuestion = getAnswerForQuestion;
const hasAnyFlags = (flags, excludeKeys = ['no_flags_baseline']) => {
    return Object.entries(flags).some(([key, value]) => !excludeKeys.includes(key) && value === true);
};
exports.hasAnyFlags = hasAnyFlags;
const getDefaultFlags = (flagKeys) => {
    const flags = {};
    flagKeys.forEach((key) => {
        flags[key] = false;
    });
    return flags;
};
exports.getDefaultFlags = getDefaultFlags;
const createQuestionMap = (questions) => {
    const map = new Map();
    if (!Array.isArray(questions)) {
        console.warn('createQuestionMap: Invalid questions array');
        return map;
    }
    questions.forEach((q) => {
        if (q && typeof q.id === 'string') {
            map.set(q.id, q);
        }
    });
    return map;
};
exports.createQuestionMap = createQuestionMap;
const deriveFlagsSafely = (deriver, questions, responses, defaultFlags) => {
    try {
        if (!Array.isArray(questions) || questions.length === 0) {
            console.warn('[deriveFlagsSafely] Invalid or empty questions array, using defaults', {
                questionsType: typeof questions,
                questionsLength: Array.isArray(questions) ? questions.length : 'N/A'
            });
            return defaultFlags;
        }
        if (!Array.isArray(responses)) {
            console.warn('[deriveFlagsSafely] Invalid responses array, using defaults', {
                responsesType: typeof responses
            });
            return defaultFlags;
        }
        const flags = deriver(questions, responses);
        if (!flags || typeof flags !== 'object') {
            console.error('[deriveFlagsSafely] Deriver returned invalid flags, using defaults', {
                flagsType: typeof flags,
                flags
            });
            return defaultFlags;
        }
        return flags;
    }
    catch (error) {
        console.error('[deriveFlagsSafely] Error during flag derivation, using defaults', {
            error: (error === null || error === void 0 ? void 0 : error.message) || error,
            stack: error === null || error === void 0 ? void 0 : error.stack,
            questionsCount: Array.isArray(questions) ? questions.length : 'N/A',
            responsesCount: Array.isArray(responses) ? responses.length : 'N/A'
        });
        return defaultFlags;
    }
};
exports.deriveFlagsSafely = deriveFlagsSafely;
exports.optionScores = {
    Always: 4,
    Often: 3,
    Sometimes: 2,
    Rarely: 1,
    Never: 0,
    Yes: 4,
    No: 0,
    'Strongly Disagree': 0,
    Disagree: 1,
    Neutral: 2,
    Agree: 3,
    'Strongly Agree': 4,
    'Not at all': 0,
    'A little': 1,
    Somewhat: 2,
    'Quite a bit': 3,
    'Very much': 4,
    'Very badly': 4,
    Badly: 3,
    Okay: 2,
    Well: 1,
    'Very well': 0,
    'Very low': 4,
    Low: 3,
    Good: 1,
    'Very good': 0,
};
const isReverseScoredQuestion = (questionText) => {
    const q = questionText.trim().toLowerCase();
    const reversePhrases = [
        'i enjoy doing things i used to enjoy',
        'i feel calm even when things go wrong',
        'i feel supported by my family during difficult times',
        "my parents/caregivers listen when i share feelings",
        'i can ask for help without feeling ashamed',
        'i feel cheerful and in good spirits',
        'i feel calm and relaxed',
        'i feel active and full of energy',
        'i feel that my life has meaning and purpose',
        'i wake up feeling fresh and rested',
        'i am confident in myself',
        'i can adapt when things change',
        "i understand and respect others' feelings",
        'i feel like i belong in school',
        'i feel respected by classmates and teachers',
        'i am satisfied with my academic performance',
        'i get along well with classmates',
        'i believe i can solve difficult tasks with effort',
        'i can manage my time and submit work on time',
        'i feel safe at home',
        'i am happy with my body image',
        'i feel mentally clear and able to recall information during practice tests and study sessions',
        'i still feel motivated to study and prepared to give my best effort in board exams',
        'the atmosphere at home is supportive and not adding to my exam stress',
        'i am getting adequate sleep (7+ hours) and my body is recovering from study stress',
        'i am not experiencing severe physical symptoms (nausea, headaches, weight loss) due to stress',
        'i believe in my ability to perform well and pass the board examinations',
        'i maintain healthy connections with friends and family despite exam pressure',
        'i have a clear strategy for managing exam day stress and performing my best',
    ];
    return reversePhrases.some((phrase) => q.includes(phrase));
};
exports.isReverseScoredQuestion = isReverseScoredQuestion;
//# sourceMappingURL=assessmentUtils.js.map