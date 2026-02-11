import * as functions from "firebase-functions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ITenantContextService, TenantInfo } from "../../../application/services/ITenantContextService";
import { FirestoreTenantContextService } from "../../../infrastructure/database/FirestoreTenantContextService";
import * as admin from 'firebase-admin';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const tenantContextService = new FirestoreTenantContextService();

export const geminiChat = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    // Fetch user data for tenant context
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found.');
    }

    const userData = userDoc.data();
    
    // Build tenant context
    const tenantInfo: TenantInfo = {
        organizationId: userData.organizationId || null,
        schoolId: userData.schoolId || 'pending',
        isIndependent: userData.isIndependent || false
    };

    // Validate tenant assignment
    if (!tenantInfo.schoolId || tenantInfo.schoolId === 'pending') {
        throw new functions.https.HttpsError('forbidden', 'User must be assigned to a school.');
    }

    const { message, history } = data as any;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const response = await result.response;

    // Store chat message under tenant path
    const chatPath = tenantContextService.getChatPath(tenantInfo);
    await admin.firestore().collection(`${chatPath}/conversations`).add({
        userId: context.auth.uid,
        message,
        response: response.text(),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        tenantInfo: tenantInfo
    });

    return { response: response.text() };
});
