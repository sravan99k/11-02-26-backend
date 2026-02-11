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
exports.updateSchool = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.updateSchool = functions.https.onCall(async (data, context) => {
    if (!context.auth)
        throw new functions.https.HttpsError('unauthenticated', 'Unauthorized');
    const { id, ...updates } = data;
    if (!id)
        throw new functions.https.HttpsError('invalid-argument', 'Missing school ID');
    const doc = await admin.firestore().collection('schools').doc(id).get();
    if (!doc.exists)
        throw new functions.https.HttpsError('not-found', 'School not found');
    const schoolData = doc.data();
    if (context.auth.token.role === 'organization' && (schoolData === null || schoolData === void 0 ? void 0 : schoolData.organizationId) !== context.auth.uid) {
        throw new functions.https.HttpsError('permission-denied', 'Unauthorized to update this school');
    }
    await admin.firestore().collection('schools').doc(id).update({
        ...updates,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
});
//# sourceMappingURL=updateSchool.js.map