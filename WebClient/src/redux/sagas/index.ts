import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import app from './app';
import category from './category';
import product from './product';

export default function* rootSaga() {
  yield all([
    fork(app),
    fork(category),
    fork(product),
  ]);
}

export const sagaMiddleware = createSagaMiddleware();
