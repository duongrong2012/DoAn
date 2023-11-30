export interface User {
    _id: string,
    username: string,
    email: string,
    fullName: string,
    avatar: string,
    phone: string,
    gender: Gender,
    address: string,
    birthDay: string,
    recoveryPasswordCode: string,
    lastLogin: string,
    createdAt: string,
    updatedAt: string,
}

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
}