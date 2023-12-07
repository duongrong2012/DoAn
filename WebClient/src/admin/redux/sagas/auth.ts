import { put, takeLeading } from 'redux-saga/effects';

import { LocalStorageKey, axiosClient } from '../../constants'
import { PayloadAction } from '@reduxjs/toolkit';
import { LoginPayload, UpdateProfilePayload } from 'redux/slices/auth/payload';
import Swal from 'sweetalert2';
import { apiErrorHandle } from 'utils';
import { AuthActions } from '../slices/auth';


function* getadminInfo() {
    try {
        const { data } = yield axiosClient.get('/quan-tri-vien');

        yield put(AuthActions.getAdminInforSuccess({
            data: data.results
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(AuthActions.getAdminInforFailure());
    }
}

function* loginAction({ payload }: PayloadAction<LoginPayload>) {

    try {
        const { data } = yield axiosClient.post('/quan-tri-vien/dang-nhap', payload);

        axiosClient.defaults.headers.Authorization = `Bearer ${data.results}`;

        localStorage.setItem(LocalStorageKey.TOKEN, data.results);

        yield getadminInfo()

    } catch (error) {
        apiErrorHandle(error)
    }
}

function* checkLoginAction() {

    const token = localStorage.getItem(LocalStorageKey.TOKEN);

    if (!token) {
        yield put(AuthActions.checkLoginDone());
        return;
    }
    axiosClient.defaults.headers.Authorization = `Bearer ${token}`;

    yield getadminInfo()
}

function* checkLogoutAction() {

    localStorage.removeItem(LocalStorageKey.TOKEN);

    yield put(AuthActions.checkLogOutDone());

}


export default function* auth() {
    yield takeLeading(AuthActions.login.type, loginAction);
    yield takeLeading(AuthActions.checkLogin.type, checkLoginAction);
    yield takeLeading(AuthActions.checkLogOut.type, checkLogoutAction);
}