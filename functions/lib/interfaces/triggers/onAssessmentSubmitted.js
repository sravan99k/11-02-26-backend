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
exports.onAssessmentSubmitted = void 0;
const functions = __importStar(require("firebase-functions"));
const FirestoreAnalyticsRepository_1 = require("../../infrastructure/database/FirestoreAnalyticsRepository");
const FirestoreUserRepository_1 = require("../../infrastructure/database/FirestoreUserRepository");
const SendGridNotificationService_1 = require("../../infrastructure/notifications/SendGridNotificationService");
const handleHighRiskIntervention_usecase_1 = require("../../application/use-cases/assessment/handleHighRiskIntervention.usecase");
const analyticsRepo = new FirestoreAnalyticsRepository_1.FirestoreAnalyticsRepository();
const userRepo = new FirestoreUserRepository_1.FirestoreUserRepository();
const notifyService = new SendGridNotificationService_1.SendGridNotificationService();
const interventionUseCase = new handleHighRiskIntervention_usecase_1.HandleHighRiskInterventionUseCase(analyticsRepo, userRepo, notifyService);
exports.onAssessmentSubmitted = functions.firestore
    .document('assessment_responses/{assessmentId}')
    .onCreate(async (snap) => {
    const assessment = snap.data();
    const { user_id, results } = assessment;
    if (results && results.overall >= 70) {
        await interventionUseCase.execute(user_id, 'High Risk', results.overall);
    }
});
//# sourceMappingURL=onAssessmentSubmitted.js.map