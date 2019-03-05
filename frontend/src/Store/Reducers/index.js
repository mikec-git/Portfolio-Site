import { combineReducers } from 'redux';
import RouteReducer from './RouteReducer';
import UIReducer from './UIReducer';
import ContactReducer from './ContactReducer';

export default combineReducers({
  route: RouteReducer,
  ui: UIReducer,
  contact: ContactReducer,
});