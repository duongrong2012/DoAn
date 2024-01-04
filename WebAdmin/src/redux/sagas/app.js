import { put, call, select, takeLeading } from 'redux-saga/effects';

import * as ActionTypes from '../actionTypes';
import { apiErrorHandler } from '../../utils';
import { axiosClient, localStorageKey } from '../../constants';

function* toggleSideBarAction() {
  const collapsed = yield select((state) => state.app.collapsed);

  localStorage.setItem(localStorageKey.SIDEBAR_COLLAPSED, collapsed);
}

function* checkLoginAction() {
  const token = localStorage.getItem(localStorageKey.TOKEN);

  if (!token) {
    yield put({ type: ActionTypes.CHECK_LOGIN_DONE });
    return;
  }

  axiosClient.defaults.headers.Authorization = `Bearer ${token}`;

  yield call(getAdminInfo);
}

function* getAdminInfo() {
  try {
    const { data } = yield axiosClient.get('/quan-tri-vien');

    localStorage.setItem(localStorageKey.RECENTLY_USERNAME, data.results.username);

    yield put({
      type: ActionTypes.GET_ADMIN_INFOR_SUCCESS,
      payload: data.results
    });

  } catch (error) {
    apiErrorHandler(error)

    yield put({
      type: ActionTypes.GET_ADMIN_INFOR_FAILED,
    });
  }
}

function* loginAction(action) {
  try {
    const { payload } = action;

    const { data } = yield axiosClient.post('/quan-tri-vien/dang-nhap', payload);

    axiosClient.defaults.headers.Authorization = `Bearer ${data.results}`;

    localStorage.setItem(localStorageKey.TOKEN, data.results);

    yield getAdminInfo()

  } catch (error) {
    apiErrorHandler(error)

    localStorage.removeItem(localStorageKey.TOKEN);
  }
}

function* logoutAction() {
  try {
    yield axiosClient.get('/logout');
  } catch (error) {

  }

  localStorage.removeItem(localStorageKey.LOGIN_INFO);

  yield put({ type: ActionTypes.LOGOUT_DONE });
}

export default function* appSaga() {
  yield takeLeading(ActionTypes.TOGGLE_SIDEBAR, toggleSideBarAction);
  yield takeLeading(ActionTypes.CHECK_LOGIN, checkLoginAction);
  yield takeLeading(ActionTypes.LOGIN, loginAction);
  yield takeLeading(ActionTypes.LOGOUT, logoutAction);
}