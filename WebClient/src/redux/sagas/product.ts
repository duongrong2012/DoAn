import { put, takeEvery } from 'redux-saga/effects';

import { axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { ProductActions } from 'redux/slices/product/index';
import { GetProductDetailPayload, GetProductsPayload } from 'redux/slices/product/payload';

function* getProductAction({ payload }: PayloadAction<GetProductsPayload>) {
    try {
        const { data } = yield axiosClient.get(`/san-pham`, { params: payload });

        yield put(ProductActions.getProductSuccess({
            data: data.results,
            stateName: payload.stateName,
            page: payload.page,
            total: data.total,
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(ProductActions.getProductFailure(payload));
    }
}

function* getProductDetail({ payload }: PayloadAction<GetProductDetailPayload>) {
    try {
        const { data } = yield axiosClient.get(`/san-pham/${payload.slug}`);

        yield put(ProductActions.getProductDetailSuccess({
            data: data.results,
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(ProductActions.getProductDetailFailure());
    }
}

export default function* product() {
    yield takeEvery(ProductActions.getProducts.type, getProductAction);
    yield takeEvery(ProductActions.getProductDetail.type, getProductDetail);
}