import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AddCartProductListPayload, AddCartProductListSuccessPayload, DeleteCartProductListPayload, DeleteCartProductListSuccessPayload, GetCartListPayload, GetCartListSuccessPayload } from './payload';
import { Cart } from 'constants/types/cart';

interface InitialState {
    cartList: Cart[],
    cartListLoading: boolean,
    addCartProductLoading: boolean,
    deleteCartProductListLoading: boolean,
}

const initialState: InitialState = {
    cartList: [],
    cartListLoading: true,
    addCartProductLoading: true,
    deleteCartProductListLoading: true,
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
        deleteCartProductList: (state, { payload }: PayloadAction<DeleteCartProductListPayload>) => {
            state.deleteCartProductListLoading = true
        },

        deleteCartProductListSuccess: (state, { payload }: PayloadAction<DeleteCartProductListSuccessPayload>) => {
            state.cartList = state.cartList.filter((item) => !payload.products.includes(item.product._id))

            state.deleteCartProductListLoading = false
        },

        deleteCartProductListFail: (state) => {
            state.deleteCartProductListLoading = false
        },

    },
});

export const CartActions = slice.actions;

export default slice;
