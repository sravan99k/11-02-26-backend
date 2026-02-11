import { db } from "../../shared/config/firebase-admin.config";
import { IWellnessRepository } from "../../domain/repositories/IWellnessRepository";

export class FirestoreWellnessRepository implements IWellnessRepository {
    async saveMood(studentId: string, moodData: any): Promise<void> {
        await db.collection("mood_entries").add({
            studentId,
            ...moodData
        });
    }
    async getMoodHistory(studentId: string): Promise<any[]> {
        const snap = await db.collection("mood_entries")
            .where("studentId", "==", studentId)
            .orderBy("timestamp", "desc")
            .get();
        return snap.docs.map(doc => doc.data());
    }
}
