"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSchoolStatsUseCase = void 0;
class GetSchoolStatsUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(schoolId) {
        const stats = await this.repository.getSchoolStats(schoolId);
        return stats;
    }
}
exports.GetSchoolStatsUseCase = GetSchoolStatsUseCase;
//# sourceMappingURL=getSchoolStats.usecase.js.map