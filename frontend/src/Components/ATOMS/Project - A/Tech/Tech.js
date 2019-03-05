import React from 'react';
import PropTypes from 'prop-types';
import c from './Tech.module.scss';

const tech = (props) => {
  return (
    <div className={c.Tech} data-text={props.techName}>
      <img 
        className={c.Tech__Image} 
        src={props.imgSrc} 
        alt={props.imgAlt} />
    </div>
  );
}

tech.propTypes = {
  techName: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired
}
 
export default tech;