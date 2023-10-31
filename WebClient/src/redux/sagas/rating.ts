import { put, takeEvery } from 'redux-saga/effects';

import { axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { RatingActions } from 'redux/slices/rating';
import { GetRatingPayload } from 'redux/slices/rating/payload';
import { PayloadAction } from '@reduxjs/toolkit';

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

export default function* Rating() {
    yield takeEvery(RatingActions.getRating.type, getRatingsAction);
}