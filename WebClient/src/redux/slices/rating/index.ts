import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Rating } from 'constants/types/rating';
import { GetRatingPayload, GetRatingSuccessPayload } from './payload';

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
    },
});

export const RatingActions = slice.actions;

export default slice;
