import { put, takeEvery } from 'redux-saga/effects';

import { axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { AddCartProductListPayload, DeleteCartProductListPayload, GetCartListPayload } from 'redux/slices/cart/payload';
import { CartActions } from 'redux/slices/cart';
import Swal from 'sweetalert2';

function* getCartListAction({ payload }: PayloadAction<GetCartListPayload>) {
    try {
        const searchParams = new URLSearchParams()

        searchParams.set("page", payload.page.toString())

        searchParams.set("limit", payload.limit.toString())

        const { data } = yield axiosClient.get(`/gio-hang?${searchParams.toString()}`);

        yield put(CartActions.getCartListSuccess({
            data: data.results,
            page: payload.page,
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(CartActions.getCartListFail());
    }
}
function* addCartProductAction({ payload }: PayloadAction<AddCartProductListPayload>) {
    try {
        yield axiosClient.post(`/gio-hang`, payload);

        yield put(CartActions.addCartProductListSuccess({
            product: payload.product,
            quantity: payload.quantity,
        }))

        if (payload.isToggleAllert) {
            yield Swal.fire({
                title: "Thêm sản phẩm thành công",
                icon: "success",
                confirmButtonText: "Xác nhận",
                confirmButtonColor: "#00cc44",
            });
        }

    } catch (error) {
        apiErrorHandle(error)

        yield put(CartActions.addCartProductListFail());
    }
}

function* deleteCartProductListAction({ payload }: PayloadAction<DeleteCartProductListPayload>) {
    try {
        yield axiosClient.delete(`/gio-hang`, { data: payload });

        yield put(CartActions.deleteCartProductListSuccess(payload))

    } catch (error) {
        apiErrorHandle(error)

        yield put(CartActions.deleteCartProductListFail());
    }
}

export default function* Cart() {
    yield takeEvery(CartActions.getCartList.type, getCartListAction);
    yield takeEvery(CartActions.addCartProductList.type, addCartProductAction);
    yield takeEvery(CartActions.deleteCartProductList.type, deleteCartProductListAction);
}