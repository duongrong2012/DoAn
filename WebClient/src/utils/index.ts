import { notification } from "antd";
import { Gender } from "constants/types/user";

export const apiErrorHandle = (error: any) => {
    const errorMessage = error.response?.data?.message ?? error.message;

    notification.error({
        message: errorMessage,
    });

    return errorMessage
}

export const getGenderLabel = (gender: Gender) => {
    const GenderLabel = {
        MALE: 'Nam',
        FEMALE: 'Nữ',
        OTHER: 'Khác',
    }
    return GenderLabel[gender]
}