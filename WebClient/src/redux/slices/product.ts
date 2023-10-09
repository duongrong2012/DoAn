import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Product } from 'constants/types/product';


interface InitialState {
    products: Product[],
    productLoading: boolean,
}

const initialState: InitialState = {
    products: [],
    productLoading: true,
};

const slice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        getProducts: (state, { payload }: PayloadAction<{ stateName: string }>) => {
            state[`${payload.stateName}Loading`] = true;
        },

        // getProductSuccess: (state, { payload }) => {
        //     state.categoryLoading = false
        //     state.Product = payload
        // },

        // getProductFailure: (state, { payload }) => {
        //     state.categoryLoading = false
        // },
    },
});

export const CategoryActions = slice.actions;

export default slice;
