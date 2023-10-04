import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  name: string
}

const initialState: InitialState = {
  name: ""
};

const slice = createSlice({
  name: 'APP',
  initialState,
  reducers: {
    setAppState: (state, { payload }: PayloadAction<Partial<InitialState>>) => {
      Object.keys(payload).forEach(item => {
        const key = item as keyof typeof payload;

        if (payload[key])
          state[key] = payload[key];
      });
    },
  },
});

export const AppActions = slice.actions;

export default slice;
