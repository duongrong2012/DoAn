import { ProductCategory } from "./category";
import { ProductImage } from "./image";
import { Order } from "./order";
import { Product } from "./product";

export interface OrderDetail {
    _id: string,
    order: Order["_id"],
    product: Product["_id"],
    name: string,
    categories: ProductCategory[],
    totalRatings: number,
    totalRatingPoints: number,
    quantity: number,
    totalSold: number,
    price: number,
    description: string,
    slug: string,
    createdAt: string,
    updatedAt: string,
    images: ProductImage[],
}