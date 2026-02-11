/**
 * Flag Derivers - Main Index
 * 
 * Central export point for all flag deriver functions across all grades (6-10) and phases (1-3).
 * 
 * Each deriver analyzes Major assessment responses and returns a flag set indicating
 * which Mini assessment scenarios should be triggered for the student.
 * 
 * Structure:
 * - grade6/: Phase 1, 2, 3 derivers for Grade 6
 * - grade7/: Phase 1, 2, 3 derivers for Grade 7
 * - grade8/: Phase 1, 2, 3 derivers for Grade 8
 * - grade9/: Phase 1, 2, 3 derivers for Grade 9
 * - grade10/: Phase 1, 2, 3 derivers for Grade 10
 * - types.ts: Shared MiniFlagsG*P* interface definitions
 */

// Grade 6
export { deriveMiniFlagsForG6P1, deriveMiniFlagsForG6P2, deriveMiniFlagsForG6P3, deriveMiniFlagsForG6P4 } from './grade6';

// Grade 7
export { deriveMiniFlagsForG7P1, deriveMiniFlagsForG7P2, deriveMiniFlagsForG7P3, deriveMiniFlagsForG7P4 } from './grade7';

// Grade 8
export { deriveMiniFlagsForG8P1, deriveMiniFlagsForG8P2, deriveMiniFlagsForG8P3, deriveMiniFlagsForG8P4 } from './grade8';

// Grade 9
export { deriveMiniFlagsForG9P1, deriveMiniFlagsForG9P2, deriveMiniFlagsForG9P3, deriveMiniFlagsForG9P4 } from './grade9';

// Grade 10
export { deriveMiniFlagsForG10P1, deriveMiniFlagsForG10P2, deriveMiniFlagsForG10P3, deriveMiniFlagsForG10P4 } from './grade10';

// Export types
export * from './types';
