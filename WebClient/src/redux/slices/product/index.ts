import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product } from 'constants/types/product';
import { GetProductsPayload, GetProductsSuccessPayload } from './payload';


export interface InitialState {
    topFiveProducts: Product[],
    topFiveProductsLoading: boolean,
}

const initialState: InitialState = {
    topFiveProducts: [],
    topFiveProductsLoading: true,
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
            state[payload.stateName] = payload.data;
            // @ts-ignore
            state[`${payload.stateName}Loading`] = false;
        },

        getProductFailure: (state) => {
            // @ts-ignore
            state[`${payload.stateName}Loading`] = false
        },
    },
});

export const ProductActions = slice.actions;

export default slice;
