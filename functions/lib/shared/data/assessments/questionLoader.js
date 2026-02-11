"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMiniByAssessmentId = exports.loadMajorByGradeAndPhase = void 0;
const majorModules = import.meta.glob('./grade-*/phase-*/major.json');
const miniModules = import.meta.glob('./grade-*/phase-*/*.json');
const loadMajorByGradeAndPhase = async (grade, phase) => {
    var _a;
    const gradeStr = typeof grade === 'string' ? grade.replace(/[^0-9]/g, '') : String(grade);
    if (!gradeStr)
        return null;
    const key = `./grade-${gradeStr}/phase-${phase}/major.json`;
    const loader = majorModules[key];
    if (!loader) {
        console.warn('[questionLoader] No major.json found for', { grade: gradeStr, phase });
        return null;
    }
    try {
        const mod = await loader();
        const data = (mod && ((_a = mod.default) !== null && _a !== void 0 ? _a : mod));
        return data || null;
    }
    catch (e) {
        console.error('[questionLoader] Failed to load major.json', { grade: gradeStr, phase }, e);
        return null;
    }
};
exports.loadMajorByGradeAndPhase = loadMajorByGradeAndPhase;
const loadMiniByAssessmentId = async (grade, phase, assessmentId) => {
    var _a;
    const gradeStr = typeof grade === 'string' ? grade.replace(/[^0-9]/g, '') : String(grade);
    if (!gradeStr || !assessmentId)
        return null;
    const basePath = `./grade-${gradeStr}/phase-${phase}/`;
    const candidateKeys = [
        `${basePath}${assessmentId}.mini.json`,
        `${basePath}${assessmentId}.json`,
    ];
    const loaderKey = candidateKeys.find((k) => miniModules[k]);
    const loader = loaderKey ? miniModules[loaderKey] : undefined;
    if (!loader) {
        console.warn('[questionLoader] No mini assessment JSON found for', {
            grade: gradeStr,
            phase,
            assessmentId,
        });
        return null;
    }
    try {
        const mod = await loader();
        const data = (mod && ((_a = mod.default) !== null && _a !== void 0 ? _a : mod));
        return data || null;
    }
    catch (e) {
        console.error('[questionLoader] Failed to load mini assessment JSON', {
            grade: gradeStr,
            phase,
            assessmentId,
        }, e);
        return null;
    }
};
exports.loadMiniByAssessmentId = loadMiniByAssessmentId;
//# sourceMappingURL=questionLoader.js.map