import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import c from './LandingBtn.module.scss';

const landingBtn = (props) => {
  return (
    <div className={c.LandingBtn} ref={props.elementRef}>
      <Link
        data-testid='landingBtn'
        to="/portfolio"
        className={c.LandingBtn__Link}
        onClick={(e) => props.routeChange(e, 'portfolio')}>
        <span className={c.LandingBtn__Text}>Portfolio</span>
        <div className={c.LandingBtn__Arrow}>
          <span></span>
          <span></span>
          <span></span>  
        </div>
      </Link>
    </div>
  );
}

landingBtn.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  routeChange: PropTypes.func.isRequired
}
 
export default landingBtn;