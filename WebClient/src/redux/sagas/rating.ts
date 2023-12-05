import { put, takeEvery } from 'redux-saga/effects';

import { axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { RatingActions } from 'redux/slices/rating';
import { CreateRatingPayload, GetRatingPayload } from 'redux/slices/rating/payload';
import { PayloadAction } from '@reduxjs/toolkit';
import { notification } from 'antd';

function* getRatingsAction({ payload }: PayloadAction<GetRatingPayload>) {
    try {
        const searchParams = new URLSearchParams()

        searchParams.set("page", payload.page.toString())

        searchParams.set("limit", payload.limit.toString())

        const { data } = yield axiosClient.get(`/san-pham/${payload.productId}/rating?${searchParams.toString()}`);

        yield put(RatingActions.getRatingSuccess({
            data: data.results,
            page: payload.page,
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(RatingActions.getRatingFail());
    }
}

function* createRatingsAction({ payload }: PayloadAction<CreateRatingPayload>) {
    try {
        const { data } = yield axiosClient.post(`/san-pham/${payload.productId}/rating`, payload);

        const success = true

        payload.callback(success) //tat modal

        notification.success({
            message: 'Gửi Đánh Giá Thành Công',
        });

        yield put(RatingActions.createRatingSuccess({
            data: data.results,
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(RatingActions.createRatingFail);
    }
}

export default function* Rating() {
    yield takeEvery(RatingActions.getRating.type, getRatingsAction);
    yield takeEvery(RatingActions.createRating.type, createRatingsAction);
}