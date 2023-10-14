import { takeLeading, put, takeEvery } from 'redux-saga/effects';

import { axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { ProductActions } from 'redux/slices/product/index';
import { GetProductsPayload } from 'redux/slices/product/payload';

function* getProductAction({ payload }: PayloadAction<GetProductsPayload>) {
    try {
        const { data } = yield axiosClient.get(`/san-pham`, { params: payload });

        yield put(ProductActions.getProductSuccess({ data: data.results, stateName: payload.stateName }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(ProductActions.getProductFailure());
    }
}

export default function* product() {
    yield takeEvery(ProductActions.getProducts.type, getProductAction);
}