import * as actionTypes from './actionTypes';

export const toggleNav = () => {
  return { type: actionTypes.TOGGLE_NAV };
}

export const preLoadImages = (images) => {
  return { type: actionTypes.PRELOAD_IMAGES, images };
}