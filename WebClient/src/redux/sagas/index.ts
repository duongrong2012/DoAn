import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import app from './app';
import category from './category';
import product from './product';
import auth from './auth';
import rating from './rating';
import order from './order';
import cart from './cart';

export default function* rootSaga() {
  yield all([
    fork(app),
    fork(category),
    fork(product),
    fork(auth),
    fork(rating),
    fork(order),
    fork(cart),
  ]);
}

export const sagaMiddleware = createSagaMiddleware();
