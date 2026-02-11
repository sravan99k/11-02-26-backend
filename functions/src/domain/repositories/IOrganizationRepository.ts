export interface Organization {
    id?: string;
    name: string;
    adminEmail: string;
    createdAt: Date;
    status: 'active' | 'suspended';
}

export interface IOrganizationRepository {
    create(org: Organization): Promise<string>;
    getById(id: string): Promise<Organization | null>;
    update(id: string, data: Partial<Organization>): Promise<void>;
    list(): Promise<Organization[]>;
}
