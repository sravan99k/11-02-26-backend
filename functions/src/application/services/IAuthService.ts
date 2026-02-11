export interface AuthUser {
    uid: string;
    email: string;
    role: string;
    displayName?: string;
}

export interface IAuthService {
    verifyToken(idToken: string): Promise<AuthUser>;
    updateUserClaims(uid: string, claims: Record<string, any>): Promise<void>;
    createUser(email: string, password: string): Promise<string>;
}
