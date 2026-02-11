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
exports.validateUser = void 0;
const functions = __importStar(require("firebase-functions"));
const FirestoreUserRepository_1 = require("../../../infrastructure/database/FirestoreUserRepository");
const FirebaseAuthService_1 = require("../../../infrastructure/auth/FirebaseAuthService");
const validateAndSyncUser_usecase_1 = require("../../../application/use-cases/users/validateAndSyncUser.usecase");
const userRepo = new FirestoreUserRepository_1.FirestoreUserRepository();
const authService = new FirebaseAuthService_1.FirebaseAuthService();
const useCase = new validateAndSyncUser_usecase_1.ValidateAndSyncUserUseCase(userRepo, authService);
exports.validateUser = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    try {
        const { uid, email } = context.auth.token;
        return await useCase.execute(uid, email || "");
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', error.message);
    }
});
//# sourceMappingURL=validateUser.js.map