export function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function createUniqueSlug(
    db: FirebaseFirestore.Firestore,
    basePath: string,
    name: string
): Promise<string> {
    let slug = createSlug(name);
    let counter = 1;
    const baseSlug = slug;

    while (true) {
        const docRef = db.doc(`${basePath}/${slug}`);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}
