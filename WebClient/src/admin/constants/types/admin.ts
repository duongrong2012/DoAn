export interface Admin {
    _id: string,
    level: 1,
    name: string,
    username: string,
    avatar: string,
    recoveryPasswordCode: string,
    status: AccountStatus,
    lastLogin: string,
    createdAt: string,
    updatedAt: string
}

enum AccountStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}