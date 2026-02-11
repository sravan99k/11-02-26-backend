"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeMessage = exports.logTriggerToFirestore = exports.analyzeTriggerWithLLM = void 0;
const openai_1 = __importDefault(require("openai"));
const firebase_1 = require("@/integrations/firebase");
const firestore_1 = require("firebase/firestore");
const openRouter = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
        "HTTP-Referer": "https://novo-wellness.ai",
        "X-Title": "Novo Wellness Trigger Detection",
    },
});
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const PRIMARY_MODEL = "meta-llama/llama-3.3-70b-instruct:free";
const FALLBACK_MODEL = "meta-llama/llama-3.2-3b-instruct:free";
const isPurelyProfanity = (message) => {
    const lowerMessage = message.toLowerCase();
    const profanityPatterns = [
        /\bf+u+c+k+/i,
        /\bs+h+i+t+/i,
        /\bb+i+t+c+h+/i,
        /\ba+s+s+h+o+l+e+/i,
        /\bd+a+m+n+/i,
        /\bc+r+a+p+/i,
        /\bh+e+l+l+/i,
    ];
    const words = message.split(/\s+/);
    if (words.length <= 3) {
        return profanityPatterns.some(pattern => pattern.test(message));
    }
    return false;
};
const analyzeTriggerWithLLM = async (message) => {
    var _a, _b, _c;
    if (!API_KEY) {
        console.warn('[TriggerAnalysis] No API key, falling back to keyword detection');
        return analyzeTriggerWithKeywords(message);
    }
    if (isPurelyProfanity(message)) {
        console.log('[TriggerAnalysis] Message contains profanity but no mental health concern');
        return {
            isTrigger: false,
            severity: 'low',
            category: 'other',
            privacySafeMessage: 'No concerning content detected.',
            reason: 'Inappropriate language detected, but no mental health concern'
        };
    }
    try {
        const prompt = `You are a safety analyzer for a student wellbeing chatbot. Analyze this message for concerning content.

CRITICAL: DO NOT FLAG PROFANITY OR EXPLICIT LANGUAGE ALONE
- If a student uses curse words, swear words, or explicit language WITHOUT mental health context, respond with isTrigger: false
- Example: "fuck this homework" → NOT a trigger (just frustration)
- Example: "I fucking hate myself and want to die" → IS a trigger (mental health concern)

CRITICAL: FILTER OUT OBVIOUS JOKES AND SARCASM
Before flagging a message, check for these JOKE INDICATORS:
- Explicit markers: "just kidding", "jk", "lol", "haha", "lmao", "rofl"
- Emojis: ":)", "😂", "🤣", ":P", ";)"
- Self-correction in same message: "kms just kidding", "want to die lol"
- Clearly sarcastic tone: "I'm so gonna die from this homework lol"

If ANY joke indicator is present with casual/playful tone, respond with isTrigger: false.
Only flag if the concern seems GENUINE despite attempts at humor (e.g., "I want to die but lol I'm fine" - this is masking, flag it).

IMPORTANT: Look for BOTH first-person AND third-person expressions of GENUINE distress:
- First-person: "I want to hurt myself", "I'm going to end it all"
- Third-person: "My friend wants to kill someone", "Someone I know is cutting themselves"

Detect these categories (use the exact JSON category strings in parentheses):
1. Harassment / Bullying ("harassment-bullying")
2. Threatening Language ("threatening-language")
3. Hate Speech ("hate-speech")
4. Illicit Behavior, including requests/instructions for illegal acts such as shoplifting ("illicit-behavior")
5. Self-Harm ("self-harm")
6. Suicidal Thoughts ("suicidal-thoughts")
7. Sexual Abuse ("sexual-abuse")
8. Violence / Violent Ideation, including threats to harm others ("violence")
9. Mental Health Concerns, including anxiety, depression, or hopelessness ("mental-health-concerns")
10. Third-Party Self-Harm – when the student talks about someone else wanting to hurt themselves ("third-party-self-harm")
11. OTHER - concerning content not fitting above categories ("other")

Consider slang and spelling variations:
- "kms" = "kill myself"
- "sh" = "self-harm"
- "depresed" = "depressed"

Student message: "${message}"

Respond ONLY with valid JSON in this exact format:
{
  "isTrigger": true or false,
  "severity": "low" or "medium" or "high" or "critical",
  "category": "harassment-bullying" | "threatening-language" | "hate-speech" | "illicit-behavior" | "self-harm" | "suicidal-thoughts" | "sexual-abuse" | "violence" | "mental-health-concerns" | "third-party-self-harm" | "other",
  "privacySafeMessage": "A professional, clinical-grade summary of the concern. DO NOT quote the student. Use third-person academic language. e.g., 'Student expresses significant academic anxiety' or 'Signals indicate potential victimization'.",
  "reason": "Internal technical explanation for why this was flagged (can include quotes for admin review)."
}

Severity guidelines (ONLY for genuine concerns):
- CRITICAL: Life-threatening/Legal emergency (active suicide plan in progress, severe physical abuse, direct threat of mass violence)
- HIGH: Immediate danger (active suicide/violence intent, severe self-harm)
- MEDIUM: Significant concern (recurring thoughts, plans forming)
- LOW: Early warning signs (feeling hopeless, stressed, overwhelmed)

Examples:
- "i want kms just kidding lol :)" → isTrigger: false (obvious joke with multiple indicators)
- "im so stressed i could die haha" → isTrigger: false (casual exaggeration)
- "I want to hurt myself" → isTrigger: true (genuine, no joke indicators)
- "sometimes I think about ending it all lol but whatever" → isTrigger: true (masking real concern)

If the message is clearly joking, sarcastic, or not concerning, respond:
{
  "isTrigger": false,
  "severity": "low",
  "category": "other",
  "privacySafeMessage": "No concerning content detected.",
  "reason": "Casual expression/joke, no genuine concern"
}`;
        let response;
        try {
            response = await openRouter.chat.completions.create({
                model: PRIMARY_MODEL,
                messages: [
                    { role: "system", content: "You are a JSON-only responder. Always return valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 200,
            });
        }
        catch (primaryError) {
            console.warn('[TriggerAnalysis] Primary model failed, trying fallback:', {
                model: PRIMARY_MODEL,
                error: primaryError.message,
                status: primaryError.status
            });
            try {
                response = await openRouter.chat.completions.create({
                    model: FALLBACK_MODEL,
                    messages: [
                        { role: "system", content: "You are a JSON-only responder. Always return valid JSON." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 200,
                });
                console.log('[TriggerAnalysis] ✅ Fallback model successful:', FALLBACK_MODEL);
            }
            catch (fallbackError) {
                console.error('[TriggerAnalysis] Both models failed:', {
                    primary: PRIMARY_MODEL,
                    fallback: FALLBACK_MODEL,
                    primaryError: primaryError.message,
                    fallbackError: fallbackError.message
                });
                throw fallbackError;
            }
        }
        const content = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
        if (!content) {
            throw new Error('No response from LLM');
        }
        let jsonContent = content.trim();
        const jsonMatch = jsonContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
            jsonContent = jsonMatch[1];
        }
        const result = JSON.parse(jsonContent);
        if (typeof result.isTrigger !== 'boolean' ||
            !['low', 'medium', 'high'].includes(result.severity) ||
            !result.category || !result.reason) {
            throw new Error('Invalid LLM response structure');
        }
        console.log('[TriggerAnalysis] LLM result:', result);
        return result;
    }
    catch (error) {
        console.error('[TriggerAnalysis] All LLM analysis methods failed:', {
            error: error.message,
            status: error.status,
            response: (_c = error.response) === null || _c === void 0 ? void 0 : _c.data,
            primaryModel: PRIMARY_MODEL,
            fallbackModel: FALLBACK_MODEL,
            hasApiKey: !!API_KEY,
            apiKeyPreview: API_KEY ? `${API_KEY.substring(0, 10)}...` : 'MISSING'
        });
        if (error.status === 500) {
            console.error('[TriggerAnalysis] OpenRouter 500 error - possible causes:', {
                cause1: 'Invalid API key',
                cause2: 'Model not accessible or down',
                cause3: 'Rate limit exceeded',
                cause4: 'Malformed request',
                suggestion: 'Check VITE_OPENROUTER_API_KEY in .env file'
            });
        }
        console.log('[TriggerAnalysis] Falling back to keyword detection');
        return analyzeTriggerWithKeywords(message);
    }
};
exports.analyzeTriggerWithLLM = analyzeTriggerWithLLM;
const analyzeTriggerWithKeywords = (message) => {
    const lowerMessage = message.toLowerCase();
    if (isPurelyProfanity(message)) {
        return {
            isTrigger: false,
            severity: 'low',
            category: 'other',
            privacySafeMessage: 'No concerning content detected.',
            reason: 'Inappropriate language without mental health concern'
        };
    }
    const jokeIndicators = [
        'just kidding', 'jk', 'lol', 'haha', 'lmao', 'rofl', 'jkjk',
        ':)', '😂', '🤣', ':p', ';)', '😅', 'kidding'
    ];
    const hasJokeIndicator = jokeIndicators.some(indicator => lowerMessage.includes(indicator));
    if (hasJokeIndicator) {
        const veryExplicitTerms = [
            'going to kill myself',
            'planning to kill myself',
            'committing suicide',
            'going to hurt myself badly'
        ];
        const hasVeryExplicit = veryExplicitTerms.some(term => lowerMessage.includes(term));
        if (!hasVeryExplicit) {
            return {
                isTrigger: false,
                severity: 'low',
                category: 'other',
                privacySafeMessage: 'No concerning content detected.',
                reason: 'Casual expression with joke indicators detected'
            };
        }
    }
    const highKeywords = {
        'suicidal-thoughts': ['kill myself', 'end my life', 'commit suicide', 'want to die'],
        'violence': ['kill someone', 'hurt someone', 'murder'],
        'self-harm': ['cut myself', 'cutting myself', 'hurt myself', 'self harm', 'self-harm', 'burning myself'],
        'third-party-self-harm': ['my friend wants to kill themselves', 'someone I know is cutting themselves']
    };
    const mediumKeywords = {
        'suicidal-thoughts': ['suicidal', 'no point living', 'better off dead'],
        'mental-health-concerns': ['severely depressed', 'hopeless', 'can\'t go on', 'give up'],
        'harassment-bullying': ['being bullied badly', 'bullying me', 'everyone bullies me'],
        'sexual-abuse': ['being abused', 'someone touches me in a bad way'],
        'threatening-language': ['i will beat you up', 'i am going to hurt you'],
        'hate-speech': ['hate those people', 'they should all die'],
        'illicit-behavior': ['how to steal', 'how to shoplift', 'how to hack']
    };
    for (const [category, keywords] of Object.entries(highKeywords)) {
        for (const keyword of keywords) {
            if (lowerMessage.includes(keyword)) {
                return {
                    isTrigger: true,
                    severity: 'high',
                    category: category,
                    privacySafeMessage: `Signals indicate critical ${category.replace(/-/g, ' ')} indicators.`,
                    reason: `Detected critical keyword: "${keyword}"`
                };
            }
        }
    }
    for (const [category, keywords] of Object.entries(mediumKeywords)) {
        for (const keyword of keywords) {
            if (lowerMessage.includes(keyword)) {
                return {
                    isTrigger: true,
                    severity: 'medium',
                    category: category,
                    privacySafeMessage: `Behavioral patterns suggest possible ${category.replace(/-/g, ' ')} concern.`,
                    reason: `Detected concerning keyword: "${keyword}"`
                };
            }
        }
    }
    return {
        isTrigger: false,
        severity: 'low',
        category: 'other',
        privacySafeMessage: 'No concerning content detected.',
        reason: 'No concerning keywords detected'
    };
};
const logTriggerToFirestore = async (data) => {
    try {
        const timestamp = Date.now();
        const documentId = `${data.studentId}_${timestamp}`;
        let studentPath = '';
        if (data.organizationId) {
            studentPath = `users/${data.adminId}/organizations/${data.organizationId}/schools/${data.schoolId}/students/${data.studentId}`;
        }
        else {
            studentPath = `users/${data.adminId}/schools/${data.schoolId}/students/${data.studentId}`;
        }
        const triggerDocRef = (0, firestore_1.doc)(firebase_1.db, `${studentPath}/chatTriggers`, documentId);
        await (0, firestore_1.setDoc)(triggerDocRef, {
            studentId: data.studentId,
            studentName: data.studentName,
            message: data.message,
            privacySafeMessage: data.privacySafeMessage,
            severity: data.severity,
            category: data.category,
            reason: data.reason,
            userId: data.userId,
            timestamp: (0, firestore_1.serverTimestamp)(),
            schoolId: data.schoolId,
            organizationId: data.organizationId || null,
            adminId: data.adminId,
            indicators: data.indicators || [],
            recommendedActions: data.recommendedActions || [],
            status: 'new'
        });
        console.log('[TriggerAnalysis] Trigger logged to Firestore:', documentId);
    }
    catch (error) {
        console.error('[TriggerAnalysis] Failed to log trigger to Firestore:', error);
    }
};
exports.logTriggerToFirestore = logTriggerToFirestore;
const analyzeMessage = async (message, userData) => {
    const result = await (0, exports.analyzeTriggerWithLLM)(message);
    if (result.isTrigger) {
        const indicators = [
            `Type: ${result.category.replace(/-/g, ' ')}`,
            `Priority: ${result.severity.toUpperCase()}`,
            `Source: AI Behavioral Synthesis`
        ];
        const recommendedActions = [
            'Immediate educational check-in required',
            'Verify signal with clinical peer review',
            'Document in student evidence history',
            'Coordinate with school wellbeing lead for next phase'
        ];
        (0, exports.logTriggerToFirestore)({
            ...userData,
            message,
            privacySafeMessage: result.privacySafeMessage,
            severity: result.severity,
            category: result.category,
            reason: result.reason,
            indicators,
            recommendedActions
        }).catch(err => {
            console.error('[TriggerAnalysis] Background logging failed:', err);
        });
    }
    return result;
};
exports.analyzeMessage = analyzeMessage;
//# sourceMappingURL=chatbotTriggers.js.map