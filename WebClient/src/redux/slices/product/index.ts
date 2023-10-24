import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product } from 'constants/types/product';
import { GetProductDetailPayload, GetProductDetailSucessPayload, GetProductsPayload, GetProductsSuccessPayload } from './payload';


export interface InitialState {
    topFiveProducts: Product[],
    topSoldProducts: Product[],
    topFiveProductsLoading: boolean,
    productDetail: Product | null,
    productDetailLoading: boolean,
}

const initialState: InitialState = {
    topFiveProducts: [],
    topSoldProducts: [],
    topFiveProductsLoading: true,
    productDetail: null,
    productDetailLoading: false,
};

const slice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        getProducts: (state, { payload }: PayloadAction<GetProductsPayload>) => {
            // @ts-ignore
            state[`${payload.stateName}Loading`] = true;
        },

        getProductSuccess: (state, { payload }: PayloadAction<GetProductsSuccessPayload>) => {
            // @ts-ignore
            if (payload.page > 1) {
                // @ts-ignore
                state[payload.stateName] = state[payload.stateName].concat(payload.data);
            } else {
                // @ts-ignore
                state[payload.stateName] = payload.data;
            }
            // @ts-ignore
            state[`${payload.stateName}Loading`] = false;
        },

        getProductFailure: (state) => {
            // @ts-ignore
            state[`${payload.stateName}Loading`] = false
        },

        getProductDetail: (state, { payload }: PayloadAction<GetProductDetailPayload>) => {
            state.productDetailLoading = true
        },

        getProductDetailSuccess: (state, { payload }: PayloadAction<GetProductDetailSucessPayload>) => {
            state.productDetail = payload.data
            state.productDetailLoading = false
        },

        getProductDetailFailure: (state) => {
            state.productDetailLoading = false
        },
    },
});

export const ProductActions = slice.actions;

export default slice;
