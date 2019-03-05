import { takeLatest, all } from 'redux-saga/effects';
import * as actionTypes from '../Actions/actionTypes';

import { sendMessageSaga } from './ContactSaga';

const watchContact = [
  takeLatest(actionTypes.SEND_MESSAGE, sendMessageSaga)
];

export default function* rootSaga() {
  yield all([
    ...watchContact
  ]);
};