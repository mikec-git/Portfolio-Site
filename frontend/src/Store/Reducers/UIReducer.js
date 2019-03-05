import * as actionTypes from '../Actions/actionTypes';
import * as storeUtil from '../Utility/storeUtility';

const initialState = {
  navIsOpen: false,
  images: {},
  imagesError: null
}

const toggleNav = (state, action) => {
  return { ...state, navIsOpen: !state.navIsOpen };
}

const preLoadImages = (state, action) => {
  return { 
    ...state, 
    images: {
      ...state.images,
      ...action.images
  } };
}

const reducer = storeUtil.createReducer(initialState, {
  [actionTypes.TOGGLE_NAV]: toggleNav,
  [actionTypes.PRELOAD_IMAGES]: preLoadImages
});

export default reducer;