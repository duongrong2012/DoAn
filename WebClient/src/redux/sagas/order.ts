import { put, takeEvery } from 'redux-saga/effects';

import { axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { OrderActions } from 'redux/slices/order';
import { GetOrderListPayload, GetOrderPayload, OrderPayload } from 'redux/slices/order/payload';
import Swal from 'sweetalert2';
import routes from 'constants/routes';
import { router } from 'App';
import { CartActions } from 'redux/slices/cart';

function* orderAction({ payload }: PayloadAction<OrderPayload>) {
    try {
        yield axiosClient.post(`/dat-hang`, payload);

        yield put(OrderActions.orderSuccess())

        const productIdList = payload.products.map((item) => item.id)

        yield put(CartActions.deleteCartProductList({ products: productIdList }))

        yield Swal.fire({
            title: "Đặt Hàng Thành Công",
            icon: "success",
            confirmButtonText: "Xác nhận",
            confirmButtonColor: "#00cc44",
        });

        router.navigate(routes.UserOrderListPage().path)

    } catch (error) {
        apiErrorHandle(error)

        yield put(OrderActions.orderFail());
    }
}

function* getOrderListAction({ payload }: PayloadAction<GetOrderListPayload>) {
    try {
        const searchParams = new URLSearchParams()

        searchParams.set("page", payload.page.toString())

        searchParams.set("limit", payload.limit.toString())

        const { data } = yield axiosClient.get(`/dat-hang?${searchParams.toString()}`);

        yield put(OrderActions.getOrderListSuccess({
            data: data.results,
            page: payload.page,
            total: data.total,
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(OrderActions.getOrderListFail());
    }
}

function* getOrderAction({ payload }: PayloadAction<GetOrderPayload>) {
    try {
        const { data } = yield axiosClient.get(`/dat-hang/chi-tiet-don-hang/${payload.id}`);

        yield put(OrderActions.getOrderSuccess({
            data: data.results,
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(OrderActions.getOrderFail());
    }
}

export default function* Order() {
    yield takeEvery(OrderActions.order.type, orderAction);
    yield takeEvery(OrderActions.getOrderList.type, getOrderListAction);
    yield takeEvery(OrderActions.getOrder.type, getOrderAction);
}