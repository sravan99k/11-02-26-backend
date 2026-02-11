import { db } from "../../shared/config/firebase-admin.config";
import { IOrganizationRepository, Organization } from "../../domain/repositories/IOrganizationRepository";

export class FirestoreOrganizationRepository implements IOrganizationRepository {
    async create(org: Organization): Promise<string> {
        const docRef = await db.collection("organizations").add(org);
        return docRef.id;
    }

    async getById(id: string): Promise<Organization | null> {
        const snap = await db.collection("organizations").doc(id).get();
        return snap.exists ? (snap.data() as Organization) : null;
    }

    async update(id: string, data: Partial<Organization>): Promise<void> {
        await db.collection("organizations").doc(id).update(data);
    }

    async list(): Promise<Organization[]> {
        const snap = await db.collection("organizations").get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Organization));
    }
}
