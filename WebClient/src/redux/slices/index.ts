import { combineReducers } from '@reduxjs/toolkit';

import app from './app';

export const rootReducer = combineReducers({
  app: app.reducer,
});
