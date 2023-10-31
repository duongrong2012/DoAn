import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetOrderDetailPayload, GetOrderDetailSuccessPayload, GetOrderPayload, GetOrderSuccessPayload, OrderPayload } from './payload';
import { Order } from 'constants/types/order';
import { OrderDetail } from 'constants/types/orderDetail';

interface InitialState {
    orderLoading: boolean,
    orderList: Order[],
    getOrderListLoading: boolean,
    orderDetailList: OrderDetail[],
    getOrderDetailListLoading: boolean,
}

const initialState: InitialState = {
    orderLoading: true,
    orderList: [],
    getOrderListLoading: true,
    orderDetailList: [],
    getOrderDetailListLoading: true,
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

        getOrder: (state, { payload }: PayloadAction<GetOrderPayload>) => {
            state.getOrderListLoading = true
        },

        getOrderSuccess: (state, { payload }: PayloadAction<GetOrderSuccessPayload>) => {
            let orderList = payload.data

            if (payload.page > 1) {
                state.orderList = [...state.orderList, ...orderList]
            } else {
                state.orderList = orderList
            }

            state.getOrderListLoading = false
        },

        getOrderFail: (state) => {
            state.getOrderListLoading = false
        },

        getOrderDetail: (state, { payload }: PayloadAction<GetOrderDetailPayload>) => {
            state.getOrderDetailListLoading = true
        },

        getOrderDetailSuccess: (state, { payload }: PayloadAction<GetOrderDetailSuccessPayload>) => {
            let orderDetailList = payload.data

            if (payload.page > 1) {
                // @ts-ignore
                state.orderDetailList = [...state.orderDetailList, ...orderDetailList]
            } else {
                // @ts-ignore
                state.orderDetailList = orderDetailList
            }

            state.getOrderDetailListLoading = false
        },

        getOrderDetailFail: (state) => {
            state.getOrderDetailListLoading = false
        },
    },
});

export const OrderActions = slice.actions;

export default slice;
