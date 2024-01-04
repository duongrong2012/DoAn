import { put, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient } from '../../constants';

function* getUserAction({ payload }) {
  try {
    const searchParams = new URLSearchParams()

    searchParams.set("page", payload.page.toString())

    searchParams.set("limit", payload.limit.toString())

    const { data } = yield axiosClient.get(`/quan-tri-vien/nguoi-dung?${searchParams.toString()}`);

    yield put({
      type: ActionTypes.GET_USERS_SUCCESS,
      payload: {
        data: data.results,
        total: data.total
      }
    });

  } catch (error) {
    yield put({ type: ActionTypes.GET_USERS_FAILED });

    apiErrorHandler(error)
  }
}

function* blockUserAction(action) {
  try {
    const status = action.payload.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"

    yield axiosClient.patch(`/quan-tri-vien/nguoi-dung/${action.payload._id}`, { status });

    yield put({
      type: ActionTypes.BLOCK_USER_SUCCESS, payload: {
        id: action.payload._id,
        status
      }
    });

  } catch (error) {
    apiErrorHandler(error)

    yield put({ type: ActionTypes.BLOCK_USER_FAILED });
  }
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.GET_USERS, getUserAction);
  yield takeLeading(ActionTypes.BLOCK_USER, blockUserAction);
}