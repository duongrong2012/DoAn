import { call, put, all, takeLeading, delay } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient, responseStatus } from '../../constants';

function* getCategories() {
  try {
    const { data } = yield axiosClient.get('/san-pham/danh-muc');

    yield put({ type: ActionTypes.GET_CATEGORIES_SUCCESS, payload: data.results });

  } catch (error) {
    apiErrorHandler(error)

    yield put({ type: ActionTypes.GET_CATEGORIES_FAILED });
  }
}

function* deleteCategory(action) {
  let errorMessage = 'Failed to delete categories';

  try {
    const { payload } = action;

    const { data } = yield axiosClient.delete('/category', {
      data: { ids: [payload.id] }
    });

    if (data.status === responseStatus.OK) {
      yield delay(3000)
      yield put({ type: ActionTypes.DELETE_CATEGORY_SUCCESS, payload });
      return;
    }

    errorMessage = data.errors?.jwt_mdlw_error ?? errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.DELETE_CATEGORY_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

function* addCategory(action) {
  try {
    const { payload } = action;

    const formData = new FormData();

    formData.append('name', payload.name);

    formData.append('image', payload.image[0].originFileObj);

    yield axiosClient.post('/quan-tri-vien/danh-muc', formData);

    yield all([
      put({ type: ActionTypes.ADD_CATEGORY_SUCCESS }),
      put({ type: ActionTypes.GET_CATEGORIES })
    ]);

  } catch (error) {
    apiErrorHandler(error)

    yield put({ type: ActionTypes.ADD_CATEGORY_FAILED });
  }
}

function* updateCategory(action) {
  try {
    const { payload } = action;
    console.log(payload)
    const formData = new FormData();

    if (payload.image[0].originFileObj) {
      formData.append('image', payload.image[0].originFileObj);
    }

    if (payload.name) {
      formData.append('name', payload.name);
    }

    yield axiosClient.patch(`/quan-tri-vien/danh-muc/${payload.categoryId}`, formData);

    yield all([
      put({ type: ActionTypes.UPDATE_CATEGORY_SUCCESS }),
      put({ type: ActionTypes.GET_CATEGORIES })
    ]);

  } catch (error) {
    apiErrorHandler(error)

    yield put({ type: ActionTypes.UPDATE_CATEGORY_FAILED });
  }

  yield put({ type: ActionTypes.UPDATE_CATEGORY_FAILED });
}

export default function* categoriesSaga() {
  yield takeLeading(ActionTypes.GET_CATEGORIES, getCategories);
  yield takeLeading(ActionTypes.ADD_CATEGORY, addCategory);
  yield takeLeading(ActionTypes.UPDATE_CATEGORY, updateCategory);
  yield takeLeading(ActionTypes.DELETE_CATEGORY, deleteCategory);
}