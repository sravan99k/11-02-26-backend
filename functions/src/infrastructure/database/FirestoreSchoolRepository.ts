import { db } from "../../shared/config/firebase-admin.config";
import { ISchoolRepository, School } from "../../domain/repositories/ISchoolRepository";

export class FirestoreSchoolRepository implements ISchoolRepository {
    async create(school: School): Promise<string> {
        const docRef = await db.collection("schools").add(school);
        return docRef.id;
    }

    async getByOrganization(orgId: string): Promise<School[]> {
        const snap = await db.collection("schools").where("organizationId", "==", orgId).get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
    }

    async getById(id: string): Promise<School | null> {
        const snap = await db.collection("schools").doc(id).get();
        return snap.exists ? (snap.data() as School) : null;
    }
}
