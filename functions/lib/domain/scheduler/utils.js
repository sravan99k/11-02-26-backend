"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectAllFlags = exports.projectSelectedFlags = void 0;
const projectSelectedFlags = (flags, keys) => {
    const result = {};
    keys.forEach(key => {
        result[key] = flags[key];
    });
    return result;
};
exports.projectSelectedFlags = projectSelectedFlags;
const projectAllFlags = (flags) => flags;
exports.projectAllFlags = projectAllFlags;
//# sourceMappingURL=utils.js.map