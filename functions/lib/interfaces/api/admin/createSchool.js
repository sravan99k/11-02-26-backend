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
exports.createSchool = void 0;
const functions = __importStar(require("firebase-functions"));
const FirestoreSchoolRepository_1 = require("../../../infrastructure/database/FirestoreSchoolRepository");
const createSchool_usecase_1 = require("../../../application/use-cases/admin/createSchool.usecase");
const schoolRepo = new FirestoreSchoolRepository_1.FirestoreSchoolRepository();
const useCase = new createSchool_usecase_1.CreateSchoolUseCase(schoolRepo);
exports.createSchool = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
    }
    const { role } = context.auth.token;
    if (role !== 'admin' && role !== 'super_admin' && role !== 'organization') {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized to create schools');
    }
    try {
        return await useCase.execute(data);
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
//# sourceMappingURL=createSchool.js.map