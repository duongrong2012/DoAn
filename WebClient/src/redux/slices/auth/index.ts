import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from 'constants/types/user';
import { GetUserInforsSuccessPayload, LoginPayload, RegisterPayload } from './payload';

interface InitialState {
    isModalOpen: boolean,
    authLoading: boolean,
    checkLoginLoading: boolean,
    user: User | null,
}

const initialState: InitialState = {
    isModalOpen: false,
    authLoading: false,
    user: null,
    checkLoginLoading: false,
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleAuthModal: (state) => {
            state.isModalOpen = !state.isModalOpen
        },

        register: (state, { payload }: PayloadAction<RegisterPayload>) => {
            state.authLoading = true
        },

        registerFail: (state) => {
            state.authLoading = false
        },

        getUserInfor: (state) => {
            state.authLoading = true
        },

        getgetUserInforSuccess: (state, { payload }: PayloadAction<GetUserInforsSuccessPayload>) => {
            state.authLoading = false
            state.isModalOpen = false
            state.user = payload.data
            state.checkLoginLoading = false
        },

        getgetUserInforFailure: (state) => {
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
            state.user = null
        },
    },
});

export const AuthActions = slice.actions;

export default slice;
