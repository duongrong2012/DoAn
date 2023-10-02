export interface ProductCategories {
    _id: string,
    name: string,
    slug: string,
    parentCategory: null | ProductCategories["_id"],
    productCount: number,
    createdAt: string,
    updatedAt: string,
}