import { notification } from "antd";

export const apiErrorHandle = (error: any) => {
    const errorMessage = error.response?.data?.message ?? error.message;

    notification.error({
        message: errorMessage,
    });

    return errorMessage
}