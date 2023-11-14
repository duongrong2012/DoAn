import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetOrderListPayload, GetOrderListSuccessPayload, GetOrderPayload, GetOrderSuccessPayload, OrderPayload } from './payload';
import { Order } from 'constants/types/order';

interface InitialState {
    orderLoading: boolean,
    orderList: Order[],
    orderListTotal: number,
    getOrderListLoading: boolean,
    order: Order | null,
    getOrderLoading: boolean,
}

const initialState: InitialState = {
    orderLoading: true,
    orderList: [],
    orderListTotal: 0,
    getOrderListLoading: true,
    order: null,
    getOrderLoading: true,
};

const slice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        order: (state, { payload }: PayloadAction<OrderPayload>) => {
            state.orderLoading = true
        },

        orderSuccess: (state) => {
            state.orderLoading = false
        },

        orderFail: (state) => {
            state.orderLoading = false
        },

        getOrderList: (state, { payload }: PayloadAction<GetOrderListPayload>) => {
            state.getOrderListLoading = true
        },

        getOrderListSuccess: (state, { payload }: PayloadAction<GetOrderListSuccessPayload>) => {
            let orderList = payload.data

            state.orderListTotal = payload.total

            state.orderList = orderList

            state.getOrderListLoading = false
        },

        getOrderListFail: (state) => {
            state.getOrderListLoading = false
        },

        getOrder: (state, { payload }: PayloadAction<GetOrderPayload>) => {
            state.getOrderLoading = true
        },

        getOrderSuccess: (state, { payload }: PayloadAction<GetOrderSuccessPayload>) => {
            state.order = payload.data

            state.getOrderLoading = false
        },

        getOrderFail: (state) => {
            state.getOrderLoading = false
        },
    },
});

export const OrderActions = slice.actions;

export default slice;
