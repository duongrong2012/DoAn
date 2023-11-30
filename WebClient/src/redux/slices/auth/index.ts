import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from 'constants/types/user';
import { GetUserInforsSuccessPayload, LoginPayload, RegisterPayload, UpdateProfilePayload } from './payload';

interface InitialState {
    isModalOpen: boolean,
    authLoading: boolean,
    checkLoginLoading: boolean,
    updateProfileLoading: boolean,
    user: User | null,
}

const initialState: InitialState = {
    isModalOpen: false,
    authLoading: false,
    user: null,
    checkLoginLoading: false,
    updateProfileLoading: false,
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

        getUserInforSuccess: (state, { payload }: PayloadAction<GetUserInforsSuccessPayload>) => {
            state.authLoading = false
            state.isModalOpen = false
            state.user = payload.data
            state.checkLoginLoading = false
        },

        getUserInforFailure: (state) => {
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

        updateProfile: (state, { payload }: PayloadAction<UpdateProfilePayload>) => {
            state.updateProfileLoading = true
        },

        updateProfileSuccess: (state, action: PayloadAction<UpdateProfilePayload>) => {
            let user = { ...state.user as User }

            const { avatar, newPassword, currentPassword, ...payload } = action.payload //tách avatar ra làm biến riêng và ra khỏi biến payload

            if (avatar) {
                user.avatar = avatar.filePreview
            }

            user = { ...user, ...payload }

            state.user = user

        },

        updateProfileFailure: (state) => {
            state.authLoading = false
            state.checkLoginLoading = false
        },

    },
});

export const AuthActions = slice.actions;

export default slice;
