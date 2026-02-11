import * as admin from "firebase-admin";
import { IAuthService, AuthUser } from "../../application/services/IAuthService";

export class FirebaseAuthService implements IAuthService {
    async verifyToken(idToken: string): Promise<AuthUser> {
        const decoded = await admin.auth().verifyIdToken(idToken);
        return {
            uid: decoded.uid,
            email: decoded.email || "",
            role: decoded.role || "student"
        };
    }

    async updateUserClaims(uid: string, claims: Record<string, any>): Promise<void> {
        await admin.auth().setCustomUserClaims(uid, claims);
    }

    async createUser(email: string, password: string): Promise<string> {
        const user = await admin.auth().createUser({
            email,
            password
        });
        return user.uid;
    }
}
