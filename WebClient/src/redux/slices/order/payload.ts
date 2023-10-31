import { Order } from "constants/types/order"
import { OrderDetail } from "constants/types/orderDetail"
import { Product } from "constants/types/product"

export interface OrderPayload {
    deliveryAddress: string,
    products: [{
        "id": Product["_id"],
        "quantity": number,
    }]
}

export interface GetOrderPayload {
    page: number,
    limit: number,
}

export interface GetOrderSuccessPayload {
    data: Order[],
    page: number,
}

export interface GetOrderDetailPayload {
    id: Order["_id"],
    page: number,
    limit: number,
}

export interface GetOrderDetailSuccessPayload {
    data: OrderDetail[],
    page: number,
}
