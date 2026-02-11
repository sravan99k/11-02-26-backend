"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetectRiskUseCase = void 0;
class DetectRiskUseCase {
    execute(score, domain) {
        if (score < 40)
            return "HIGH_RISK";
        if (score < 60)
            return "MODERATE_RISK";
        return "HEALTHY";
    }
}
exports.DetectRiskUseCase = DetectRiskUseCase;
//# sourceMappingURL=detectRisk.usecase.js.map