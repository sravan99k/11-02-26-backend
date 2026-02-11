import { db } from "../../shared/config/firebase-admin.config";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

export class FirestoreUserRepository implements IUserRepository {
    async getById(id: string): Promise<any> {
        const snap = await db.doc(users/ + id).get();
        return snap.exists ? snap.data() : null;
    }
    async update(id: string, data: any): Promise<void> {
        await db.doc(users/ + id).update(data);
    }
    async getBySchool(schoolId: string): Promise<any[]> {
        const snap = await db.collection("users").where("schoolId", "==", schoolId).get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}
