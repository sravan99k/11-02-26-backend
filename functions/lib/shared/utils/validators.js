"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequired = exports.validateEmail = void 0;
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
exports.validateEmail = validateEmail;
const isRequired = (val) => val !== undefined && val !== null && val !== '';
exports.isRequired = isRequired;
//# sourceMappingURL=validators.js.map