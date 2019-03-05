import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import NavItem from '../../../ATOMS/Navigation - A/NavItem/NavItem';
import c from './NavItems.module.scss';

const navItems = (props) => {
  let navList = props.navRoutes.map(route => {
    return (
      <NavItem
        key={route.to || route.resume}
        to={route.to}
        routeName={route.routeName}
        routeChange={props.routeChange}
        routeTo={route.routeTo}
        isResume={route.isResume}
        resume={route.resume}
        toggleNav={props.toggleNav}
        id={route.id} />
    );
  });

  return (
    <CSSTransition
      in={props.navIsOpen}
      mountOnEnter
      unmountOnExit
      classNames={{}}
      timeout={1000} >
       <div 
        data-testid='navitems'
        className={c.NavItems}
        ref={props.elementRef}>
        {navList}
      </div>
   </CSSTransition>
  );
}

navItems.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  navIsOpen: PropTypes.bool.isRequired,
  routeChange: PropTypes.func.isRequired,
  navRoutes: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  toggleNav: PropTypes.func
}
 
export default navItems;