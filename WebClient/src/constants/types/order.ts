import { OrderDetail } from "./orderDetail";
import { User } from "./user";

export interface Order {
    _id: string,
    user: User["_id"]
    orderDetails: OrderDetail[]
    deliveryAddress: string,
    status: keyof OrderStatus,
    createdAt: string,
    updatedAt: string,
}

export enum OrderStatus {
    PROCESSING = 'PROCESSING',
    DELIVERING = 'DELIVERING',
    DELIVERED = 'DELIVERED',
}