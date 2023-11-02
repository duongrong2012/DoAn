import { combineReducers } from '@reduxjs/toolkit';

import app from './app';
import category from './category';
import product from './product';
import auth from './auth';
import rating from './rating';
import order from './order';
import cart from './cart';

export const rootReducer = combineReducers({
  app: app.reducer,
  category: category.reducer,
  product: product.reducer,
  auth: auth.reducer,
  rating: rating.reducer,
  order: order.reducer,
  cart: cart.reducer,
});
