import { Gender, User } from "constants/types/user";

export interface GetUserInforsSuccessPayload {
    data: User
}

export interface RegisterPayload {
    username: string,
    email: string,
    phone: string,
    fullName: string,
    password: string,
    gender: string,
}

export interface LoginPayload {
    username: string,
    password: string,
}

export interface UpdateProfilePayload {
    currentPassword?: string,
    newPassword?: string,
    fullName?: string,
    gender?: Gender,
    phone?: string,
    birthDay?: string,
    avatar?: {
        filePreview: string,
        fileSend: File,
    }
}