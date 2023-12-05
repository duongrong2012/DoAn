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

export interface CreateRatingPayload {
    productId: Product['_id'],
    comment: Rating['comment'],
    rating: Rating['rating'],
    callback: (success: boolean) => void
}
export interface CreateRatingSuccessPayload {
    data: Rating
}