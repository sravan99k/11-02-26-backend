"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlug = createSlug;
exports.createUniqueSlug = createUniqueSlug;
function createSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
async function createUniqueSlug(db, basePath, name) {
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
//# sourceMappingURL=slug.js.map