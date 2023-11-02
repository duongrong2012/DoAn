import { notification } from "antd";
import { OrderStatus } from "constants/types/order";
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

export const getOrderStatusLabel = (status: OrderStatus) => {
    const orderStatusLabel = {
        PROCESSING: 'Đang xử lý',
        DELIVERING: 'Đang giao hàng',
        DELIVERED: 'Đã giao',
    }
    return orderStatusLabel[status]
}

export const readFile = (file: File) => {
    return new Promise<FileReader>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader);
        reader.onerror = error => reject(error);
    });
}