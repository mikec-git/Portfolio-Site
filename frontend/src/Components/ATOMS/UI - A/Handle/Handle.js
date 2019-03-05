import React from 'react';
import PropTypes from 'prop-types';

import c from './Handle.module.scss';
import arrow from '../../../../Assets/img/Vectors/angle-arrow.svg';

const handle = (props) => {
  let handleClasses = null;
  let arrowClasses = null;
  let ref = null;
  let mobilePageNumber = null;
  let onClickHandlerLeft = () => props.changeProject('up');
  let onClickHandlerRight = () => props.changeProject('down');

  if(props.isDesktop) {
    ref = props.elementRef;
    handleClasses = ['handle', c.Handle, props.handleClass, c.Handle_pageIndicator];
    arrowClasses = [c.Handle__LeftArrow, c.Handle__LeftArrow_arrow, c.Handle__RightArrow, c.Handle__RightArrow_arrow];
  } 
  
  if(props.isMobile) {
    ref = props.mobileNumRef;
    handleClasses = [c.Handle__Mobile];
    arrowClasses = [c.Handle__MobileLeftArrow, c.Handle__MobileLeftArrow_arrow, c.Handle__MobileRightArrow, c.Handle__MobileRightArrow_arrow];
    mobilePageNumber = props.currentSlide;
  }
  
  return (
    <div ref={ref} className={handleClasses.join(' ')}>
      <span className={c.Handle__Current}>{props.currentSlide}</span>
      <span className={arrowClasses[0]}>
        <img         
          onClick={onClickHandlerLeft}
          className={arrowClasses[1]} src={arrow} alt="Arrow Left"/>
      </span>
      <span ref={props.slashRef} className={c.Handle__Slash}></span>
      <span className={c.Handle__MobilePageNum}>{mobilePageNumber}</span>
      <span className={arrowClasses[2]}>
        <img 
          onClick={onClickHandlerRight}
          className={arrowClasses[3]} src={arrow} alt="Arrow Right"/>
      </span>
      <span className={c.Handle__Total}>{props.totalSlides}</span>
    </div>
  );
}

handle.propTypes = {
  isMobile: PropTypes.bool,
  isDesktop: PropTypes.bool,
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  mobileNumRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  slashRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  changeProject: PropTypes.func.isRequired,
  handleClass: PropTypes.string,
  totalSlides: PropTypes.number,
  currentSlide: PropTypes.number.isRequired
}
 
export default handle;