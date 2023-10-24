import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import app from './app';
import category from './category';
import product from './product';
import auth from './auth';

export default function* rootSaga() {
  yield all([
    fork(app),
    fork(category),
    fork(product),
    fork(auth),
  ]);
}

export const sagaMiddleware = createSagaMiddleware();
