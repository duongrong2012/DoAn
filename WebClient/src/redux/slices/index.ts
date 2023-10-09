import { combineReducers } from '@reduxjs/toolkit';

import app from './app';
import category from './category';

export const rootReducer = combineReducers({
  app: app.reducer,
  category: category.reducer,
});
