import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AddCartProductListPayload, AddCartProductListSuccessPayload, GetCartListPayload, GetCartListSuccessPayload } from './payload';
import { Cart } from 'constants/types/cart';

interface InitialState {
    cartList: Cart[],
    cartListLoading: boolean,
    addCartProductLoading: boolean,
}

const initialState: InitialState = {
    cartList: [],
    cartListLoading: true,
    addCartProductLoading: true,
};

const slice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

        getCartList: (state, { payload }: PayloadAction<GetCartListPayload>) => {
            state.cartListLoading = true
        },

        getCartListSuccess: (state, { payload }: PayloadAction<GetCartListSuccessPayload>) => {
            const cartList = payload.data

            if (payload.page > 1) {
                state.cartList = [...state.cartList, ...cartList]
            } else {
                state.cartList = cartList
            }

            state.cartListLoading = false
        },

        getCartListFail: (state) => {
            state.cartListLoading = false
        },

        addCartProductList: (state, { payload }: PayloadAction<AddCartProductListPayload>) => {
            state.addCartProductLoading = true
        },

        addCartProductListSuccess: (state, { payload }: PayloadAction<AddCartProductListSuccessPayload>) => {
            const index = state.cartList.findIndex((item) => item.product._id === payload.product)

            if (index !== -1) {
                state.cartList[index].quantity = payload.quantity
            }

            state.addCartProductLoading = false
        },

        addCartProductListFail: (state) => {
            state.addCartProductLoading = false
        },

    },
});

export const CartActions = slice.actions;

export default slice;
