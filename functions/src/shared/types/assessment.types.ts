export interface AssessmentBackend {
    id: string;
    studentId: string;
    grade: string;
    phase: string;
    answers: Record<string, any>;
    scoredAt: Date;
    riskScore: number;
}
