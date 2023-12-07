import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { GetAdminInforsSuccessPayload, LoginPayload } from './payload';
import { Admin } from 'admin/constants/types/admin';

interface InitialState {
    authLoading: boolean,
    checkLoginLoading: boolean,
    admin: Admin | null,
}

const initialState: InitialState = {
    authLoading: false,//check loading tren nut dang nhap
    admin: null,
    checkLoginLoading: false,//check tu dong dang nhap
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        getAdminInfor: (state) => {
            state.authLoading = true
        },

        getAdminInforSuccess: (state, { payload }: PayloadAction<GetAdminInforsSuccessPayload>) => {
            state.authLoading = false
            state.admin = payload.data
            state.checkLoginLoading = false
        },

        getAdminInforFailure: (state) => {
            state.authLoading = false
            state.checkLoginLoading = false
        },

        login: (state, { payload }: PayloadAction<LoginPayload>) => {
        },

        checkLogin: (state) => {
        },

        checkLogOut: (state) => {
        },

        checkLoginDone: (state) => {
            state.checkLoginLoading = false
        },

        checkLogOutDone: (state) => {
            state.checkLoginLoading = false
            state.admin = null
        },

    },
});

export const AuthActions = slice.actions;

export default slice;
