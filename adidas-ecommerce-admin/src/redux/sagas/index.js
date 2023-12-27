import { all, fork } from 'redux-saga/effects';

import appSaga from './app';
import usersSaga from './users';
import productsSaga from './products';
import categoriesSaga from './categories';
import transactionsSaga from './transactions'
import revenueSaga from './revenue'

export default function* rootSaga() {
  yield all([
    fork(appSaga),
    fork(usersSaga),
    fork(revenueSaga),
    fork(productsSaga),
    fork(categoriesSaga),
    fork(transactionsSaga),
  ]);
}
