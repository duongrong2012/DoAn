import { User } from "constants/types/user";

export interface GetUserInforsSuccessPayload {
    data: User
}

export interface RegisterPayload {
    username: string,
    email: string,
    fullName: string,
    password: string,
    gender: string,
}

export interface LoginPayload {
    username: string,
    password: string,
}