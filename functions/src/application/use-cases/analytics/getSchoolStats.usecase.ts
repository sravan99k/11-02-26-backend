import { IAnalyticsRepository } from "../../../domain/repositories/IAnalyticsRepository";

export class GetSchoolStatsUseCase {
    constructor(private repository: IAnalyticsRepository) {}

    async execute(schoolId: string) {
        // Logic to compile stats, perhaps checking cache or aggregating
        const stats = await this.repository.getSchoolStats(schoolId);
        return stats;
    }
}
