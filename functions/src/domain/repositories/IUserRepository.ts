export interface IUserRepository {
    getById(id: string): Promise<any>;
    update(id: string, data: any): Promise<void>;
    getBySchool(schoolId: string): Promise<any[]>;
}
