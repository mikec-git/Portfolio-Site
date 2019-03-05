import React from 'react';
import PropTypes from 'prop-types';
import c from './LandscapeWarning.module.scss';

const landscapeWarning = (props) => {
  return ( 
  <div className={c.LandscapeWarning}>
    <p className={c.LandscapeWarning__Text}>
      Please Rotate Your Screen!
    </p>
    <img 
      className={c.LandscapeWarning__Image} 
      src={props.imgSrc} 
      alt={props.imgAlt}/>
  </div>
  );
}

landscapeWarning.propTypes = {
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string
}
 
export default landscapeWarning;