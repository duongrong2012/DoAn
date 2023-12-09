import axios from 'axios';
import { AppActions } from 'redux/slices/app';
import clientStore from 'redux/store';
import adminStore from '../admin/redux/store';

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
        const isRefreshClientCaptcha = clientStore.getState().app.isRefreshCaptcha

        const isRefreshAdminCaptcha = adminStore.getState().app.isRefreshCaptcha

        clientStore.dispatch(AppActions.setAppState({ isRefreshCaptcha: !isRefreshClientCaptcha }))

        adminStore.dispatch(AppActions.setAppState({ isRefreshCaptcha: !isRefreshAdminCaptcha }))
    }

    return config
})
