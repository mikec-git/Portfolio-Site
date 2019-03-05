import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import c from './NavItem.module.scss';

const navItem = (props) => {
  if(!props.isResume) {
    return ( 
      <NavLink 
        data-testid={props.routeName + ' Link'}
        to={props.to}
        className={c.NavItem}
        onClick={(e) => props.routeChange(e, props.routeTo)}>
        <div className={c.NavItem__TextWrapper}>
          <span className={c.NavItem__Text}>
            {props.routeName}
          </span>
        </div>
        <span className={c.NavItem__Number}>{props.id}</span>
      </NavLink>
    );
  } else {
    return (
      <a 
        data-testid={props.routeName + ' Link'}
        href={props.resume}
        className={c.NavItem}
        target='_blank'
        rel="noopener noreferrer"
        onClick={props.toggleNav} >
        <div className={c.NavItem__TextWrapper}>
          <span className={c.NavItem__Text}>
            {props.routeName}
          </span>
        </div>
        <span className={c.NavItem__Number}>{props.id}</span>
      </a>
    )
  }
}

navItem.propTypes = {
  to: PropTypes.string,
  routeName: PropTypes.string.isRequired,
  routeChange: PropTypes.func.isRequired,
  routeTo: PropTypes.string,
  isResume: PropTypes.bool,
  resume: PropTypes.string,
  toggleNav: PropTypes.func,
  id: PropTypes.number.isRequired,
}
 
export default navItem;