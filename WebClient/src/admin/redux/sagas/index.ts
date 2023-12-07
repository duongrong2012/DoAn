import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import app from './app';


export default function* rootSaga() {
  yield all([
    fork(app),
  ]);
}

export const sagaMiddleware = createSagaMiddleware();
