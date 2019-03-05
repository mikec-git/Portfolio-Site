import * as actionTypes from '../Actions/actionTypes';
import * as storeUtil from '../Utility/storeUtility';

const initialState = {
  routeIsSliding: false
}

const toggleRouteSliding = (state, action) => {
  return { ...state, routeIsSliding: action.toggleState };
}

const reducer = storeUtil.createReducer(initialState, {
  [actionTypes.TOGGLE_ROUTE_SLIDING]: toggleRouteSliding
});

export default reducer;