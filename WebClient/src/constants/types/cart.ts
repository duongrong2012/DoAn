import { Product } from "./product";

export interface Cart {
    _id: string,
    user: string,
    product: Product,
    quantity: number,
    createdAt: string,
    updatedAt: string,
}