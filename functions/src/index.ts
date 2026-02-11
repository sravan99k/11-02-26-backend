import './config/firebase-admin.config';

// --- ADMIN API ---
export * from './adapters/http/admin/createOrganization';
export * from './adapters/http/admin/updateOrganization';
export * from './adapters/http/admin/createSchool';
export * from './adapters/http/admin/updateSchool';

// --- AUTH API ---
export * from './adapters/http/auth/validateUser';
export * from './adapters/http/auth/updateUserRole';
export * from './adapters/http/auth/deleteUser';

// --- USERS API ---
export * from './adapters/http/users/students/createStudent';
export * from './adapters/http/users/students/updateStudent';
export * from './adapters/http/users/students/deleteStudent';
export * from './adapters/http/users/students/bulkImport';

export * from './adapters/http/users/teachers/createTeacher';
export * from './adapters/http/users/teachers/updateTeacher';
export * from './adapters/http/users/teachers/deleteTeacher';
export * from './adapters/http/users/teachers/bulkImport';

// --- ASSESSMENTS API ---
export * from './adapters/http/assessments/getQuestions';
export * from './adapters/http/assessments/submitAssessment';
export * from './adapters/http/assessments/getResults';
export * from './adapters/http/assessments/getHistory';

// --- ANALYTICS API ---
export * from './adapters/http/analytics/getSchoolStats';
export * from './adapters/http/analytics/getStudentProgress';
export * from './adapters/http/analytics/getClassStats';
export * from './adapters/http/analytics/generateReport';

// --- WELLNESS API ---
export * from './adapters/http/wellness/saveMood';
export * from './adapters/http/wellness/saveJournal';
export * from './adapters/http/wellness/saveGoal';
export * from './adapters/http/wellness/getWellnessData';

// --- CHAT API ---
export * from './adapters/http/chat/geminiChat';

// --- NOTIFICATIONS API ---
export * from './adapters/http/notifications/sendEmail';
export * from './adapters/http/notifications/sendPushNotification';

// --- STORAGE API ---
export * from './adapters/http/storage/uploadFile';
export * from './adapters/http/storage/processCSV';

// --- TRANSCRIPTION API ---
export * from './adapters/http/transcription/transcribeAudio';

// --- TRIGGERS ---
export * from './adapters/events/onUserCreated';
export * from './adapters/events/onAssessmentSubmitted';
export * from './adapters/events/onHighRiskDetected';
export * from './adapters/events/scheduledTasks';
