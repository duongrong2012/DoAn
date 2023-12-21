import { Modal } from 'antd';
import { push } from 'connected-react-router';
import { put, call, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient, responseStatus, routes } from '../../constants';

function* getTransactions({ payload }) {
  try {
    const searchParams = new URLSearchParams()

    searchParams.set("page", payload.page.toString())

    searchParams.set("limit", payload.limit.toString())

    if (payload.userId) {
      searchParams.set("user", payload.userId.toString())
    }

    const { data } = yield axiosClient.get(`/quan-tri-vien/don-hang?${searchParams.toString()}`);

    yield put({
      type: ActionTypes.GET_TRANSACTIONS_SUCCESS,
      payload: {
        data: data.results,
        total: data.total
      }
    });

  } catch (error) {
    yield put({ type: ActionTypes.GET_TRANSACTIONS_FAILED });

    apiErrorHandler(error)
  }
}

function* getTransactionDetail({ payload }) {
  try {
    const { data } = yield axiosClient.get(`/quan-tri-vien/chi-tiet-don-hang/${payload.orderId}`);

    yield put({
      type: ActionTypes.GET_TRANSACTIONS_DETAIL_SUCCESS,
      payload: data.results
    });

  } catch (error) {
    yield put({ type: ActionTypes.GET_TRANSACTIONS_DETAIL_FAILED });

    apiErrorHandler(error)
  }
}

function* updateTransaction(action) {
  let errorMessage = 'Failed to update order';

  try {
    const { payload } = action;

    const { data } = yield axiosClient.put(`/transaction/${payload.id}`, {
      status: payload.status,
    });

    if (data.status === responseStatus.OK) {
      Modal.success({
        title: 'Thành công',
        content: 'Cập nhật đơn hàng thành công',
      });

      yield put({ type: ActionTypes.UPDATE_TRANSACTION_SUCCESS, payload });
      return;
    }

    errorMessage = (data.errors?.jwt_mdlw_error ?? data.results?.error) || errorMessage;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.UPDATE_TRANSACTION_FAILED });

  yield call(apiErrorHandler, errorMessage);
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.GET_TRANSACTIONS, getTransactions);
  yield takeLeading(ActionTypes.GET_TRANSACTIONS_DETAIL, getTransactionDetail);
  yield takeLeading(ActionTypes.UPDATE_TRANSACTION, updateTransaction);
}