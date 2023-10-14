import { combineReducers } from '@reduxjs/toolkit';

import app from './app';
import category from './category';
import product from './product';

export const rootReducer = combineReducers({
  app: app.reducer,
  category: category.reducer,
  product: product.reducer,
});
