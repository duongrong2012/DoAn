import { combineReducers } from '@reduxjs/toolkit';

import app from './app';
import category from './category';
import product from './product';
import auth from './auth';

export const rootReducer = combineReducers({
  app: app.reducer,
  category: category.reducer,
  product: product.reducer,
  auth: auth.reducer,
});
