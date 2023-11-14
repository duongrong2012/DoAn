import { Product } from 'constants/types/product';
import { InitialState } from '.';
import { ProductCategory } from 'constants/types/category';

export interface GetProductsPayload {
  stateName: keyof InitialState;
  page?: number;
  limit?: number;
  sort?: "createdAt" | "totalSold"
  category?: ProductCategory["slug"][]
  keyword?: string
}

export interface GetProductsSuccessPayload {
  data: Product[];
  stateName: GetProductsPayload["stateName"];
  page: number | undefined
  total: number,
}

export interface GetProductsFailurePayload {
  stateName: GetProductsPayload["stateName"];
}

export interface GetProductDetailPayload {
  slug: string,
}

export interface GetProductDetailSucessPayload {
  data: Product
}