import { IAnalyticsRepository } from "../../../domain/repositories/IAnalyticsRepository";
import { INotificationService } from "../../../application/services/INotificationService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class HandleHighRiskInterventionUseCase {
    constructor(
        private analyticsRepo: IAnalyticsRepository,
        private userRepo: IUserRepository,
        private INotificationService: INotificationService
    ) { }

    async execute(studentId: string, riskCategory: string, riskPercentage: number) {
        if (riskCategory !== 'High Risk') return;

        // 1. Log the alert for the school dashboard
        const alert = {
            studentId,
            type: 'HIGH_RISK_DETECTION',
            severity: 'CRITICAL',
            message: `Student flagged with ${riskPercentage}% risk level.`,
            timestamp: new Date(),
            status: 'PENDING'
        };
        await this.analyticsRepo.saveAlert(alert);

        // 2. Find the teacher/counselor for this student
        const student = await this.userRepo.getById(studentId);
        if (student && student.schoolId) {
            // In a real app, you'd find the specific assigned teacher or school admin
            // For now, we'll notify a generic school contact
            await this.INotificationService.sendEmail(
                "counselor@school.edu",
                "URGENT: High Risk Student Detected",
                `High risk detected for student ${student.displayName || studentId}. Please review the dashboard.`
            );
        }
    }
}
