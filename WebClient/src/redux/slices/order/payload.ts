import { Order } from "constants/types/order"
import { Product } from "constants/types/product"

export interface OrderPayload {
    deliveryAddress: string,
    products: [{
        "id": Product["_id"],
        "quantity": number,
    }]
}

export interface GetOrderListPayload {
    page: number,
    limit: number,
}

export interface GetOrderListSuccessPayload {
    data: Order[],
    page: number,
    total: number,
}

export interface GetOrderPayload {
    id: Order["_id"],
}

export interface GetOrderSuccessPayload {
    data: Order,
}
