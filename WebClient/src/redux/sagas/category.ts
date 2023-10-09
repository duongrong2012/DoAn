import { takeLeading, put } from 'redux-saga/effects';

import { axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { PayloadAction } from '@reduxjs/toolkit';
import { CategoryActions } from 'redux/slices/category';

function* getCategoriesAction({ payload }: PayloadAction<{ id: string }>) {
    try {
        const { data } = yield axiosClient.get('/san-pham/danh-muc');

        yield put(CategoryActions.getCategoriesSuccess(data.results));

    } catch (error) {
        apiErrorHandle(error)

        yield put(CategoryActions.getCategoriesFailure());
    }
}

export default function* category() {
    yield takeLeading(CategoryActions.getCategories.type, getCategoriesAction);
}