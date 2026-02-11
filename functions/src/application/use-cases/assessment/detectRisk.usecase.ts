export class DetectRiskUseCase {
  execute(score: number, domain: string) {
    // Logic from flagEngine
    if (score < 40) return "HIGH_RISK";
    if (score < 60) return "MODERATE_RISK";
    return "HEALTHY";
  }
}
