import * as contactActions from '../Actions/ContactActions';
import { put, call } from 'redux-saga/effects';
import { contactAxios } from '../../Shared/axios';
import moment from 'moment';

export function* sendMessageSaga(action) {
  try {
    // Set loading state to true...
    yield put(contactActions.sendMessageInit());

    // Send the client's local time to server...
    const dateSent = moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a");

    // Construct message body to send to server...
    const body = {
      Name: action.message.name,
      Email: action.message.email,
      Message: action.message.message,
      Date: dateSent
    };

    // POST request to server...
    const sendMailResponse = yield call(contactAxios, {data: body});

    // Construct successful response from server...
    const response = {
      data: sendMailResponse.data,
      statusCode: sendMailResponse.status
    };

    // Send response to reducer...
    yield put(contactActions.sendMessageSuccess(response));
  } catch (error) {
    // Construct error response from server...
    const statusCode = error && error.response ? error.response.status : 502;
    const errorMsg = statusCode !== 502 ? error.response.data : ['A problem occurred while sending the message. Please try again later!'];

    const response = {
      error: errorMsg,
      statusCode: statusCode
    };
    
    // Send error response to reducer...
    yield put(contactActions.sendMessageFail(response));
  }
}