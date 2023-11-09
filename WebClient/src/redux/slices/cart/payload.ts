import { Cart } from "constants/types/cart";
import { Product } from "constants/types/product";

export interface GetCartListPayload {
    page: number,
    limit: number,
}

export interface GetCartListSuccessPayload {
    data: Cart[],
    page: number,
}

export interface AddCartProductListPayload {
    product: Product["_id"],
    quantity: number,
    isToggleAllert: boolean,
}

export interface AddCartProductListSuccessPayload {
    product: Product["_id"],
    quantity: number,
}
export interface DeleteCartProductListPayload {
    products: Product["_id"][]
}
export interface DeleteCartProductListSuccessPayload {
    products: Product["_id"][]
}