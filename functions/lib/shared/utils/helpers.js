"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = exports.sleep = void 0;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
const generateId = () => Math.random().toString(36).substring(2, 11);
exports.generateId = generateId;
//# sourceMappingURL=helpers.js.map