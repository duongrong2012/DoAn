import axios from 'axios';
import { AppActions } from 'redux/slices/app';
import store from 'redux/store';

export const host = process.env.REACT_APP_API_HOST;

export const axiosClient = axios.create({
    baseURL: `${host}`
});

export enum LocalStorageKey {
    TOKEN = "TOKEN",
}

export const ratingListLimit = 10

export const orderListLimit = 10

export const dateFormat = 'DD/MM/YYYY';

export const reCaptChaSiteKey = "6LfiwhEpAAAAANF0-Mr6KyMgPdRvi_f4-lGs96OH"

export const reCaptChaSecretKey = "6LfiwhEpAAAAAPgaBbPomjohN06bBum7mjTd36Ct"

axiosClient.interceptors.request.use((config) => {
    if (["dang-nhap", "dang-ki"].some((item) => config.url?.includes(item))) {
        const isRefreshCaptcha = store.getState().app.isRefreshCaptcha

        store.dispatch(AppActions.setAppState({ isRefreshCaptcha: !isRefreshCaptcha }))
    }

    return config
})
