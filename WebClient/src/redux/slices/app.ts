import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  isRefreshCaptcha: boolean,
}

const initialState: InitialState = {
  isRefreshCaptcha: false
};

const slice = createSlice({
  name: 'APP',
  initialState,
  reducers: {
    setAppState: (state, { payload }: PayloadAction<Partial<InitialState>>) => {
      Object.keys(payload).forEach(item => {
        const key = item as keyof typeof payload;

        if (payload[key] !== undefined)
          state[key] = payload[key];
      });
    },
  },
});

export const AppActions = slice.actions;

export default slice;
