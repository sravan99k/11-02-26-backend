export interface School {
    id?: string;
    organizationId: string;
    name: string;
    location: string;
    principalEmail: string;
    createdAt: Date;
}

export interface ISchoolRepository {
    create(school: School): Promise<string>;
    getByOrganization(orgId: string): Promise<School[]>;
    getById(id: string): Promise<School | null>;
}
