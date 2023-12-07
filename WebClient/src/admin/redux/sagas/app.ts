import { takeLeading } from 'redux-saga/effects';

import { AppActions } from 'redux/slices/app';

function* setAppState() {

}

export default function* app() {
  yield takeLeading(AppActions.setAppState.type, setAppState);
}
