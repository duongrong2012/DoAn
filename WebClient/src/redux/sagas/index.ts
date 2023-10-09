import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import app from './app';
import category from './category';

export default function* rootSaga() {
  yield all([
    fork(app),
    fork(category),
  ]);
}

export const sagaMiddleware = createSagaMiddleware();
