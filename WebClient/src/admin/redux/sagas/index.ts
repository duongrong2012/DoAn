import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import app from './app';
import auth from './auth';


export default function* rootSaga() {
  yield all([
    fork(app),
    fork(auth),
  ]);
}

export const sagaMiddleware = createSagaMiddleware();
