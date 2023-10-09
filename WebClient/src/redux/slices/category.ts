import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ProductCategory } from 'constants/types/category';

interface InitialState {
    categories: ProductCategory[],
    categoryLoading: boolean,
}

const initialState: InitialState = {
    categories: [],
    categoryLoading: true,
};

const slice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        getCategories: (state) => {
            state.categoryLoading = true
        },

        getCategoriesSuccess: (state, { payload }) => {
            state.categoryLoading = false
            state.categories = payload
        },

        getCategoriesFailure: (state) => {
            state.categoryLoading = false
        },
    },
});

export const CategoryActions = slice.actions;

export default slice;
