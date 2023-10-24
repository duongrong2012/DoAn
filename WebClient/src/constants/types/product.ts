import { ProductCategory } from "./category";
import { ProductImage } from "./image";

export interface Product {
    _id: string,
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