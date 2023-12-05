import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Rating } from 'constants/types/rating';
import { CreateRatingPayload, CreateRatingSuccessPayload, GetRatingPayload, GetRatingSuccessPayload } from './payload';

interface InitialState {
    ratingList: Rating[],
    ratingListLoading: boolean,
    createRatingLoading: boolean,
}

const initialState: InitialState = {
    ratingList: [],
    ratingListLoading: true,
    createRatingLoading: false,
};

const slice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        getRating: (state, { payload }: PayloadAction<GetRatingPayload>) => {
            state.ratingListLoading = true
        },

        getRatingSuccess: (state, { payload }: PayloadAction<GetRatingSuccessPayload>) => {
            let ratingList = payload.data

            if (payload.page > 1) {
                state.ratingList = [...state.ratingList, ...ratingList]
            } else {
                state.ratingList = ratingList
            }

            state.ratingListLoading = false
        },

        getRatingFail: (state) => {
            state.ratingListLoading = false
        },

        createRating: (state, { payload }: PayloadAction<CreateRatingPayload>) => {
            state.createRatingLoading = true
        },

        createRatingSuccess: (state, { payload }: PayloadAction<CreateRatingSuccessPayload>) => {
            const ratingItem = payload.data as Rating

            let ratingList = [...state.ratingList]

            const ratingItemIndex = ratingList.findIndex((item) => item._id === ratingItem._id)

            if (ratingItemIndex !== -1) {
                ratingList[ratingItemIndex] = ratingItem
            } else {
                ratingList = [ratingItem, ...ratingList]
            }

            state.ratingList = ratingList

            state.createRatingLoading = false
        },

        createRatingFail: (state) => {
            state.createRatingLoading = false
        },
    },
});

export const RatingActions = slice.actions;

export default slice;
