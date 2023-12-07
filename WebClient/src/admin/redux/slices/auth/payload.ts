import { Admin } from "admin/constants/types/admin";
import { Gender, User } from "constants/types/user";

export interface GetAdminInforsSuccessPayload {
    data: Admin
}

export interface LoginPayload {
    username: string,
    password: string,
}
