export interface ProductCategory {
    _id: string,
    name: string,
    slug: string,
    image: string,
    parentCategory: null | ProductCategory["_id"],
    productCount: number,
    createdAt: string,
    updatedAt: string,
}