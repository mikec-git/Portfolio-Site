import * as actionTypes from './actionTypes';

export const sendMessage = (message) => {
  return { type: actionTypes.SEND_MESSAGE, message };
}

export const sendMessageInit = () => {
  return { type: actionTypes.SEND_MESSAGE_INIT };
}

export const sendMessageSuccess = (response) => {
  return { type: actionTypes.SEND_MESSAGE_SUCCESS, response };
}

export const sendMessageFail = (error) => {
  return { type: actionTypes.SEND_MESSAGE_FAIL, error };
}
