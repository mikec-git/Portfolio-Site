import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import * as contactActions from './ContactActions';
import * as uiActions from './UIActions';
import * as routeActions from './RouteActions';
import * as actionTypes from './actionTypes';

describe('contact action creators', () => {  
  it('should create an action to send a message', () => {
    const message = {
      name: 'Mike',
      email: 'mc@gmail.com',
      message: 'This is a test message'
    };

    const expectedAction = {
      type: actionTypes.SEND_MESSAGE,
      message
    };

    expect(contactActions.sendMessage(message)).toEqual(expectedAction);
  });

  it('should create an action to initialize send message', () => {
    const expectedAction = {
      type: actionTypes.SEND_MESSAGE_INIT
    };

    const unexpectedAction = {
      type: actionTypes.SEND_MESSAGE_INIT,
      someData: 'something wrong'
    };

    const someData = 'something wrong';

    expect(contactActions.sendMessageInit()).toEqual(expectedAction);
    expect(contactActions.sendMessageInit(someData)).not.toEqual(unexpectedAction);
  });
  
  it('should create an action for a successfully sent message', () => {
    const response = {
      text: 'some data back from server',
      statusCode: 500
    };

    const wrongResponse = 'data back from server';

    const expectedAction = {
      type: actionTypes.SEND_MESSAGE_SUCCESS,
      response: {
        text: 'some data back from server',
        statusCode: 500
      }
    };

    const unexpectedAction = {
      type: actionTypes.SEND_MESSAGE_SUCCESS
    };

    expect(contactActions.sendMessageSuccess(response)).toEqual(expectedAction);
    expect(contactActions.sendMessageSuccess(wrongResponse)).not.toEqual(expectedAction);
    expect(contactActions.sendMessageSuccess()).toEqual(unexpectedAction);
  });
  
  it('should create an action for a failed message', () => {
    const error = 'Something went wrong sending the message';

    const expectedAction = {
      type: actionTypes.SEND_MESSAGE_FAIL,
      error: 'Something went wrong sending the message'
    };

    expect(contactActions.sendMessageFail(error)).toEqual(expectedAction);
  });
});

describe('route action creators', () => {  
  it('should toggle route-sliding state', () => {
    const toggleState = false;

    const expectedAction = {
      type: actionTypes.TOGGLE_ROUTE_SLIDING,
      toggleState: false
    };
    
    const unexpectedAction = {
      type: actionTypes.TOGGLE_ROUTE_SLIDING,
      toggleState: true
    }

    expect(routeActions.toggleRouteSliding(toggleState)).toEqual(expectedAction);
    expect(routeActions.toggleRouteSliding(toggleState)).not.toEqual(unexpectedAction);
  });
});

describe('UI action creators', () => {  
  it('should create and action to toggle navigation state', () => {
    const expectedAction = {
      type: actionTypes.TOGGLE_NAV
    };
    
    expect(uiActions.toggleNav()).toEqual(expectedAction);
  });
  
  it('should create an action to store pre-loaded images', () => {
    const images = {
      github: {},
      node: {},
      javascript: {},
      aspnet: {}
    };

    const expectedAction = {
      type: actionTypes.PRELOAD_IMAGES,
      images: {
        github: {},
        node: {},
        javascript: {},
        aspnet: {},
      }
    };
    
    expect(uiActions.preLoadImages(images)).toEqual(expectedAction);
  });
})