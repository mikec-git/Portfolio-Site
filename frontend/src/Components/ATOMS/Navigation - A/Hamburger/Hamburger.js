import React from 'react';
import PropTypes from 'prop-types';
import c from './Hamburger.module.scss';

const hamburger = (props) => {
  let hamburgerClasses = [c.Burger];
  
  if(props.navIsOpen) {
    hamburgerClasses.push(c.open);
  }   

  return (
    <div 
      data-testid="hamburger"
      ref={props.elementRef}
      className={hamburgerClasses.join(' ')}
      onClick={props.navToggle}>
      <span className={c.Burger__TopWrapper}>
        <span ref={props.layerRef[0]} className={c.Burger__Top}></span>
      </span>
      <span className={c.Burger__MidWrapper}>
        <span ref={props.layerRef[1]} className={c.Burger__Mid}></span>
      </span>
      <span className={c.Burger__BotWrapper}>
        <span ref={props.layerRef[2]} className={c.Burger__Bot}></span>
      </span>
      <span 
        className={c.Burger__Ring} 
        ref={props.ringRef}>
      </span>
      <span 
        className={c.Burger__BgCircle} 
        ref={props.bgCircleRef}>
      </span>
    </div>
  );
}

hamburger.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  layerRef: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])),
  ringRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  bgCircleRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  navIsOpen: PropTypes.bool.isRequired,
  navToggle: PropTypes.func
}
 
export default hamburger;