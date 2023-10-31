import { Product } from "constants/types/product";
import { Rating } from "constants/types/rating";

export interface GetRatingPayload {
    productId: Product["_id"],
    page: number,
    limit: number,
}

export interface GetRatingSuccessPayload {
    data: Rating[],
    page: number,
}