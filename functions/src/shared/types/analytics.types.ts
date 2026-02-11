export interface StudentAnalytics {
    studentId: string;
    assessmentCount: number;
    averageScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    lastAssessmentDate: Date;
    progressTrend: 'improving' | 'stable' | 'declining';
}

export interface SchoolAnalytics {
    schoolId: string;
    totalStudents: number;
    assessmentCompletionRate: number;
    averageWellnessScore: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    gradeWiseData: GradeAnalytics[];
}

export interface GradeAnalytics {
    grade: number;
    studentCount: number;
    averageScore: number;
    riskDistribution: {
        high: number;
        medium: number;
        low: number;
    };
}

export interface TeacherAnalytics {
    teacherId: string;
    classesCount: number;
    studentsCount: number;
    assessmentsReviewed: number;
    incidentsReported: number;
}

export interface OrganizationAnalytics {
    organizationId: string;
    schoolsCount: number;
    totalStudents: number;
    totalTeachers: number;
    overallWellnessScore: number;
    schoolWisePerformance: SchoolPerformance[];
}

export interface SchoolPerformance {
    schoolId: string;
    schoolName: string;
    studentCount: number;
    wellnessScore: number;
    rank: number;
}
