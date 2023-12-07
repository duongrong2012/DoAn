import { combineReducers } from '@reduxjs/toolkit';
import app from './app';
import auth from './auth';

export const rootReducer = combineReducers({
  app: app.reducer,
  auth: auth.reducer,
});
