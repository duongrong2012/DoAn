import { ProductCategory } from "./category";

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
}