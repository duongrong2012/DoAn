import { put, takeLeading } from 'redux-saga/effects';

import { LocalStorageKey, axiosClient } from '../../constants'
import { apiErrorHandle } from '../../utils';
import { AuthActions } from 'redux/slices/auth';
import { PayloadAction } from '@reduxjs/toolkit';
import { LoginPayload, RegisterPayload, UpdateProfilePayload } from 'redux/slices/auth/payload';
import Swal from 'sweetalert2';

function* registerAction({ payload }: PayloadAction<RegisterPayload>) {
    try {
        const { data } = yield axiosClient.post(`/nguoi-dung/dang-ki`, payload);

        axiosClient.defaults.headers.Authorization = `Bearer ${data.results}`;

        localStorage.setItem(LocalStorageKey.TOKEN, data.results);

        yield getUserInfo()

    } catch (error) {
        apiErrorHandle(error)

        yield put(AuthActions.registerFail());
    }
}

function* getUserInfo() {
    try {
        const { data } = yield axiosClient.get('/nguoi-dung');

        yield put(AuthActions.getUserInforSuccess({
            data: data.results
        }));

    } catch (error) {
        apiErrorHandle(error)

        yield put(AuthActions.getUserInforFailure());
    }
}

function* loginAction({ payload }: PayloadAction<LoginPayload>) {

    try {
        const { data } = yield axiosClient.post('/nguoi-dung/dang-nhap', payload);

        axiosClient.defaults.headers.Authorization = `Bearer ${data.results}`;

        localStorage.setItem(LocalStorageKey.TOKEN, data.results);

        yield getUserInfo()

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

    yield getUserInfo()
}

function* checkLogoutAction() {

    localStorage.removeItem(LocalStorageKey.TOKEN);

    yield put(AuthActions.checkLogOutDone());

}

function* updateProfileAction({ payload }: PayloadAction<UpdateProfilePayload>) {
    try {
        const formData = new FormData();

        Object.keys(payload).forEach(key => {
            const itemKey = key as keyof UpdateProfilePayload

            if (itemKey === "avatar") {
                formData.append(itemKey, payload[itemKey]!.fileSend)
            } else if (payload[itemKey]) {
                formData.append(itemKey, payload[itemKey]!)
            }
        });

        yield axiosClient.patch(`/nguoi-dung`, formData);

        yield put(AuthActions.updateProfileSuccess(payload));

        Swal.fire({
            title: "Cập nhật thành công",
            icon: "success",
            confirmButtonText: "Xác nhận",
            confirmButtonColor: "#00cc44"
        })

    } catch (error) {
        apiErrorHandle(error)

        yield put(AuthActions.updateProfileFailure());
    }
}


export default function* auth() {
    yield takeLeading(AuthActions.register.type, registerAction);
    yield takeLeading(AuthActions.login.type, loginAction);
    yield takeLeading(AuthActions.checkLogin.type, checkLoginAction);
    yield takeLeading(AuthActions.checkLogOut.type, checkLogoutAction);
    yield takeLeading(AuthActions.updateProfile.type, updateProfileAction);
}