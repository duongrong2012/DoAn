import { Product } from 'constants/types/product';
import { InitialState } from '.';
import { ProductCategory } from 'constants/types/category';

export interface GetProductsPayload {
  stateName: keyof InitialState;
  page?: number;
  limit?: number;
  sort?: "createdAt" | "totalSold"
  category?: ProductCategory["slug"][]
}

export interface GetProductsSuccessPayload {
  data: Product[];
  stateName: GetProductsPayload["stateName"];
  page: number | undefined
}

export interface GetProductDetailPayload {
  slug: string,
}

export interface GetProductDetailSucessPayload {
  data: Product
}