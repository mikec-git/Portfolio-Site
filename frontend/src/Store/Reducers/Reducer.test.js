import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import contactReducer from './ContactReducer';
import uiReducer from './UIReducer';
import routeReducer from './RouteReducer';
import * as actionTypes from '../Actions/actionTypes';

describe('contact reducer', () => {  
  it('should return the initial state', () => {
    expect(contactReducer(undefined, {})).toEqual({
      error: {
        name: [null],
        email: [null],
        message: [null],
        server: [null]
      },
      statusCode: null,
      isSent: false,
      loading: false
    });
  });

  it('should handle SEND_MESSAGE_INIT', () => {
    expect(contactReducer(undefined, {
      type: actionTypes.SEND_MESSAGE_INIT
    })).toEqual({
      error: {
        name: [null],
        email: [null],
        message: [null],
        server: [null]
      },
      statusCode: null,
      isSent: false,
      loading: true
    })
  });
  
  it('should handle SEND_MESSAGE_SUCCESS', () => {
    expect(contactReducer({
      error: {
        name: ['Name is invalid'],
        email: ['Email is incorrect'],
        message: [null],
        server: [null]
      },
      statusCode: 400,
      isSent: false,
      loading: true
    }, {
      type: actionTypes.SEND_MESSAGE_SUCCESS,
      response: {
        statusCode: 201
      }
    })).toEqual({
      error: {
        name: [null],
        email: [null],
        message: [null],
        server: [null]
      },
      statusCode: 201,
      isSent: true,
      loading: false
    })
  });

  it('should handle SEND_MESSAGE_FAIL', () => {
    expect(contactReducer(undefined, {
      type: actionTypes.SEND_MESSAGE_FAIL,
      error: {
        statusCode: 400,
        error: {
          Name: ['Incorrect name'],
          Email: ['Incorrect email'],
          Message: ['Incorrect message']
        }
      }
    })).toEqual({
      error: {
        name: ['Incorrect name'],
        email: ['Incorrect email'],
        message: ['Incorrect message'],
        server: [null]
      },
      statusCode: 400,
      isSent: false,
      loading: false
    });
    
    expect(contactReducer(undefined, {
      type: actionTypes.SEND_MESSAGE_FAIL,
      error: {
        statusCode: 502,
        error: ['A problem occurred while sending the message. Please try again later!']
      }
    })).toEqual({
      error: {
        name: [null],
        email: [null],
        message: [null],
        server: ['A problem occurred while sending the message. Please try again later!']
      },
      statusCode: 502,
      isSent: false,
      loading: false
    });
    
    expect(contactReducer(undefined, {
      type: actionTypes.SEND_MESSAGE_FAIL,
      error: {
        statusCode: 504,
        error: ['A problem occurred while sending the message. Please try again later!']
      }
    })).toEqual({
      error: {
        name: [null],
        email: [null],
        message: [null],
        server: ['A problem occurred while sending the message. Please try again later!']
      },
      statusCode: 504,
      isSent: false,
      loading: false
    });
  });
});

describe('UI reducer', () => {
  it('should return the initial state', () => {
    expect(uiReducer(undefined, {})).toEqual({      
      navIsOpen: false,
      images: {},
      imagesError: null
    })
  });

  it('should handle TOGGLE_NAV', () => {
    expect(uiReducer(undefined, {
      type: actionTypes.TOGGLE_NAV
    })).toEqual({
      navIsOpen: true,
      images: {},
      imagesError: null
    });
    
    expect(uiReducer({
      navIsOpen: true,
      images: {},
      imagesError: null
    }, {
      type: actionTypes.TOGGLE_NAV
    })).toEqual({
      navIsOpen: false,
      images: {},
      imagesError: null
    });    
  });

  it('should handle PRELOAD_IMAGES', () => {
    expect(uiReducer(undefined, {
      type: actionTypes.PRELOAD_IMAGES,
      images: {
        image1: {},
        image2: {},
        image3: {}
      }
    })).toEqual({
      navIsOpen: false,
      images: {
        image1: {},
        image2: {},
        image3: {}
      },
      imagesError: null
    });
  });
});

describe('Route reducer', () => {
  it('should return the initial state', () => {
    expect(routeReducer(undefined, {})).toEqual({      
      routeIsSliding: false
    });
  });

  it('should handle TOGGLE_ROUTE_SLIDING', () => {
    expect(routeReducer(undefined, {
      type: actionTypes.TOGGLE_ROUTE_SLIDING,
      toggleState: true
    })).toEqual({
      routeIsSliding: true
    });
    
    expect(routeReducer(undefined, {
      type: actionTypes.TOGGLE_ROUTE_SLIDING,
      toggleState: false
    })).toEqual({
      routeIsSliding: false
    });
  });
});