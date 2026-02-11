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
exports.submitAssessment = void 0;
const functions = __importStar(require("firebase-functions"));
const FirestoreAssessmentRepository_1 = require("../../../infrastructure/database/FirestoreAssessmentRepository");
const submitAssessment_usecase_1 = require("../../../application/use-cases/assessment/submitAssessment.usecase");
const calculateScore_usecase_1 = require("../../../application/use-cases/assessment/calculateScore.usecase");
const detectRisk_usecase_1 = require("../../../application/use-cases/assessment/detectRisk.usecase");
const repository = new FirestoreAssessmentRepository_1.FirestoreAssessmentRepository();
const calculateScore = new calculateScore_usecase_1.CalculateScoreUseCase();
const detectRisk = new detectRisk_usecase_1.DetectRiskUseCase();
const submitUseCase = new submitAssessment_usecase_1.SubmitAssessmentUseCase(repository, calculateScore, detectRisk);
exports.submitAssessment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }
    const { assessmentId, responses, schoolPath } = data;
    if (!responses || !schoolPath) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing responses or school path.');
    }
    try {
        const result = await submitUseCase.execute({
            studentId: context.auth.uid,
            schoolPath,
            responses
        });
        return {
            success: true,
            data: result
        };
    }
    catch (error) {
        console.error("[API submitAssessment] Error:", error);
        throw new functions.https.HttpsError('internal', error.message || 'Failed to submit assessment');
    }
});
//# sourceMappingURL=submitAssessment.js.map