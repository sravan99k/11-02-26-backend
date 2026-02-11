"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleHighRiskInterventionUseCase = void 0;
class HandleHighRiskInterventionUseCase {
    constructor(analyticsRepo, userRepo, INotificationService) {
        this.analyticsRepo = analyticsRepo;
        this.userRepo = userRepo;
        this.INotificationService = INotificationService;
    }
    async execute(studentId, riskCategory, riskPercentage) {
        if (riskCategory !== 'High Risk')
            return;
        const alert = {
            studentId,
            type: 'HIGH_RISK_DETECTION',
            severity: 'CRITICAL',
            message: `Student flagged with ${riskPercentage}% risk level.`,
            timestamp: new Date(),
            status: 'PENDING'
        };
        await this.analyticsRepo.saveAlert(alert);
        const student = await this.userRepo.getById(studentId);
        if (student && student.schoolId) {
            await this.INotificationService.sendEmail("counselor@school.edu", "URGENT: High Risk Student Detected", `High risk detected for student ${student.displayName || studentId}. Please review the dashboard.`);
        }
    }
}
exports.HandleHighRiskInterventionUseCase = HandleHighRiskInterventionUseCase;
//# sourceMappingURL=handleHighRiskIntervention.usecase.js.map