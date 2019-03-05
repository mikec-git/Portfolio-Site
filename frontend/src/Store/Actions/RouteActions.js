import * as actionTypes from './actionTypes';

export const toggleRouteSliding = (toggleState) => {
  return { type: actionTypes.TOGGLE_ROUTE_SLIDING, toggleState };
}
