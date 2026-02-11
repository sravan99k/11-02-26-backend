"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
(0, vitest_1.describe)('Assessment Analysis', () => {
    const rootDir = path.resolve(__dirname, '../');
    const files = [];
    const errors = [];
    const warnings = [];
    const questionIds = new Set();
    const assessmentIds = new Set();
    function scanDir(dir) {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
            if (entry === 'validation')
                continue;
            const fullPath = path.join(dir, entry);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                scanDir(fullPath);
            }
            else if (entry.endsWith('.json')) {
                files.push(fullPath);
            }
        }
    }
    (0, vitest_1.it)('analyzes all assessment JSON files', () => {
        console.log('Starting Assessment Analysis...');
        scanDir(rootDir);
        console.log(`Found ${files.length} JSON files.`);
        let totalQuestions = 0;
        for (const file of files) {
            const relativePath = path.relative(rootDir, file);
            try {
                const content = fs.readFileSync(file, 'utf-8');
                const data = JSON.parse(content);
                if (!data.metadata || !data.questions) {
                    errors.push(`${relativePath}: Missing metadata or questions object.`);
                    continue;
                }
                if (!data.metadata.assessmentId) {
                    errors.push(`${relativePath}: Missing assessmentId in metadata.`);
                }
                else {
                    if (assessmentIds.has(data.metadata.assessmentId)) {
                        errors.push(`${relativePath}: Duplicate assessmentId '${data.metadata.assessmentId}'.`);
                    }
                    assessmentIds.add(data.metadata.assessmentId);
                }
                if (!data.metadata.grade)
                    warnings.push(`${relativePath}: Missing grade in metadata.`);
                if (!data.metadata.phase)
                    warnings.push(`${relativePath}: Missing phase in metadata.`);
                if (!Array.isArray(data.questions)) {
                    errors.push(`${relativePath}: 'questions' is not an array.`);
                    continue;
                }
                totalQuestions += data.questions.length;
                data.questions.forEach((q, idx) => {
                    const qRef = `${relativePath} Q#${q.questionNumber || idx + 1}`;
                    if (!q.id) {
                        errors.push(`${qRef}: Missing question ID.`);
                    }
                    else {
                        if (questionIds.has(q.id)) {
                            errors.push(`${qRef}: Duplicate question ID '${q.id}'.`);
                        }
                        questionIds.add(q.id);
                    }
                    if (!q.question)
                        errors.push(`${qRef}: Missing question text.`);
                    if (!q.responseType)
                        errors.push(`${qRef}: Missing responseType.`);
                    if (!q.responseOptions) {
                        errors.push(`${qRef}: Missing responseOptions.`);
                    }
                    else {
                        if (q.responseType !== 'text' && (!q.responseOptions.options && !q.responseOptions.scale)) {
                            errors.push(`${qRef}: responseOptions missing 'options' or 'scale' for type ${q.responseType}.`);
                        }
                        if (q.responseOptions.values && q.responseOptions.options && q.responseOptions.values.length !== q.responseOptions.options.length) {
                            errors.push(`${qRef}: Mismatch between options count and values count.`);
                        }
                        if (q.responseOptions.values && q.responseOptions.scale && q.responseOptions.values.length !== q.responseOptions.scale.length) {
                            errors.push(`${qRef}: Mismatch between scale count and values count.`);
                        }
                    }
                });
            }
            catch (e) {
                errors.push(`${relativePath}: Failed to parse JSON or invalid structure. ${e.message}`);
            }
        }
        console.log('\n--- Analysis Report ---');
        console.log(`Total Files Scanned: ${files.length}`);
        console.log(`Total Questions: ${totalQuestions}`);
        console.log(`Unique Assessment IDs: ${assessmentIds.size}`);
        console.log(`Unique Question IDs: ${questionIds.size}`);
        if (errors.length > 0) {
            console.error('\nErrors Found:');
            errors.forEach(e => console.error(`[ERROR] ${e}`));
        }
        else {
            console.log('\nNo errors found.');
        }
        if (warnings.length > 0) {
            console.warn('\nWarnings:');
            warnings.forEach(w => console.warn(`[WARN] ${w}`));
        }
        else {
            console.log('\nNo warnings found.');
        }
        (0, vitest_1.expect)(errors.length).toBe(0);
    });
});
//# sourceMappingURL=analysis.test.js.map