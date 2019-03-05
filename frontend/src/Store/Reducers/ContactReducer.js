import * as actionTypes from '../Actions/actionTypes';
import * as storeUtil from '../Utility/storeUtility';
import _ from 'lodash';

const initialState = {
  error: {
    name: [null],
    email: [null],
    message: [null],
    server: [null]
  },
  statusCode: null,
  isSent: false,
  loading: false
};

// Sets loading to true
const sendMessageInit = (state, action) => {
  return {...state, loading: true};
};

// If message was sent successfully...
const sendMessageSuccess = (state, action) => {
  return {
    ...state, 
    error: {
      name: [null],
      email: [null],
      message: [null],
      server: [null]
    },
    statusCode: action.response.statusCode,
    isSent: true,
    loading: false
  };
};

// If there was a problem sending the message...
const sendMessageFail = (state, action) => {
  const errorResponse = action.error;
  
  let error = {    
    name: [null],
    email: [null],
    message: [null],
    server: [null]
  };

  // Bad request (validation failed)... 
  if(errorResponse.statusCode === 400) {
    // Converts uppercase prop names to lowercase...
    const lowerCaseError = _.transform(errorResponse.error, (accumulator, value, key) => {
      accumulator[key.toLowerCase()] = value;
    });

    error = { ...error, ...lowerCaseError };
    // Error sending the email or timeout (504)...
  } else if(errorResponse.statusCode === 502 || errorResponse.statusCode === 504) {
    error = { ...error, server: errorResponse.error };
  } 
  
  return {
    ...state, 
    error: error,
    statusCode: errorResponse.statusCode,
    // 500 is a database save error...still sent the message
    isSent: errorResponse.statusCode === 500 ? true : false,
    loading: false
  };
};

const reducer = storeUtil.createReducer(initialState, {
  [actionTypes.SEND_MESSAGE_INIT]: sendMessageInit,
  [actionTypes.SEND_MESSAGE_SUCCESS]: sendMessageSuccess,
  [actionTypes.SEND_MESSAGE_FAIL]: sendMessageFail,
});

export default reducer;