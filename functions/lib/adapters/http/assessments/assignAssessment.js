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
exports.assignAssessment = void 0;
const functions = __importStar(require("firebase-functions"));
const FirestoreAssessmentAssignmentRepository_1 = require("../../../infrastructure/database/FirestoreAssessmentAssignmentRepository");
const assignAssessment_usecase_1 = require("../../../application/use-cases/assessment/assignAssessment.usecase");
const assignmentRepo = new FirestoreAssessmentAssignmentRepository_1.FirestoreAssessmentAssignmentRepository();
const useCase = new assignAssessment_usecase_1.AssignAssessmentUseCase(assignmentRepo);
exports.assignAssessment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }
    const { role } = context.auth.token;
    if (role !== 'teacher' && role !== 'management' && role !== 'admin') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized to assign assessments');
    }
    try {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return await useCase.execute({
            ...data,
            startDate,
            endDate
        });
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
//# sourceMappingURL=assignAssessment.js.map