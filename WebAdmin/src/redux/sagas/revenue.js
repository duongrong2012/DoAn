import { put, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { axiosClient, responseStatus } from '../../constants';
import { apiErrorHandler } from '../../utils';

function* getBestSellerProducts() {
  try {
    const { data } = yield axiosClient.get(`/san-pham`, {
      params: { sort: 'totalSold' },
    });

    yield put({
      type: ActionTypes.GET_BEST_SELLER_PRODUCTS_SUCCESS,
      payload: { data: data.results },
    });
  } catch (error) {
    apiErrorHandler(error);

    yield put({ type: ActionTypes.GET_BEST_SELLER_PRODUCTS_FAILED });
  }
}

function* getRevenue(action) {
  try {
    const { payload } = action;

    const { data } = yield axiosClient.get('/quan-tri-vien/doanh-thu', { params: payload });

    yield put({ type: ActionTypes.GET_REVENUE_SUCCESS, payload: data.results });
  } catch (error) {
    apiErrorHandler(error);

    yield put({ type: ActionTypes.GET_REVENUE_FAILED });
  }
}

function* getYearBudgetAction(action) {
  let errorMessage = '';

  try {
    const { payload } = action;

    const { data } = yield axiosClient.get(`/order/admin/budget-date?date=01-01-${payload.dateString}&group=${payload.viewType}`);

    if (data.status === responseStatus.OK) {
      const budgets = data.results
        .sort((a, b) => a[payload.viewType] - b[payload.viewType])
        .map((item) => ({ ...item, price: +item.price }))
      yield put({ type: ActionTypes.GET_YEARBUDGET_SUCCESS, payload: budgets });
      return;
    }

    errorMessage = data.errors.jwt_mdlw_error;
  } catch (error) {
    errorMessage = error.response?.data?.errors?.jwt_mdlw_error ?? error.message;
  }

  yield put({ type: ActionTypes.GET_YEARBUDGET_FAILED });

  alert(errorMessage);
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.GET_REVENUE, getRevenue);
  yield takeLeading(ActionTypes.GET_BEST_SELLER_PRODUCTS, getBestSellerProducts);
  yield takeLeading(ActionTypes.GET_YEARBUDGET, getYearBudgetAction);
}