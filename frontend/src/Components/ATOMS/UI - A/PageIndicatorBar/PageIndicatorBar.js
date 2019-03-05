import React, { PureComponent } from 'react';
import { TimelineMax, Power2 } from 'gsap';
import PropTypes from 'prop-types';

import c from './PageIndicatorBar.module.scss';

class PageIndicatorBar extends PureComponent {
  leftBarRef  = React.createRef();
  rightBarRef = React.createRef();

  componentDidMount() {
    this.tl = new TimelineMax();
    this.leftBar  = this.leftBarRef.current;
    this.rightBar = this.rightBarRef.current;
  }

  componentDidUpdate(prevProps) {
    const { animating, handlePosition, barWidth, initLoaded } = this.props;

    if(animating) {
      const { currentSlideIndex, calculateNewHandlePosition, transitionDuration } = this.props;
      if(currentSlideIndex !== prevProps.currentSlideIndex) {
        const handlePos = calculateNewHandlePosition();
        this.tl.clear();
        this.tl
        .to(this.leftBar, transitionDuration, {right: this.calcLeftBarEnd(handlePos), ease: Power2.easeInOut})
        .to(this.rightBar, transitionDuration, {left: this.calcRightBarStart(handlePos), ease: Power2.easeInOut}, 0);
      }
    } else {
      if(handlePosition !== prevProps.handlePosition) {
        this.changeBarPositionWhileDrag();
      }
    }

    if(barWidth !== prevProps.barWidth) {
      this.changeBarPositionWhileDrag();
    }
    
    if(!initLoaded) {
      this.onPageResizeOrDrag();
    }
  }
  
  changeBarPositionWhileDrag = () => {
    const { handlePosition, initLoaded, resizing, handleDelay } = this.props;
    this.tl.clear();
    
    if(initLoaded && !resizing) {
      this.tl
        .to(this.leftBar, handleDelay, {right: this.calcLeftBarEnd(handlePosition), overwrite: 'all'})
        .to(this.rightBar, handleDelay, {left: this.calcRightBarStart(handlePosition), overwrite: 'all'}, 0);
    } else {
      this.onPageResizeOrDrag();
    }
  }

  onPageResizeOrDrag = () => {
    const { initLoaded ,toggleInitLoaded, handlePosition } = this.props
    !initLoaded && toggleInitLoaded();
      this.tl
        .set(this.leftBar, {right: this.calcLeftBarEnd(handlePosition), overwrite: 'all'})
        .set(this.rightBar, {left: this.calcRightBarStart(handlePosition), overwrite: 'all'}, 0);
  }
  
  calcLeftBarEnd = (handlePosition) => {
    const { barWidth, minX, handleWidth } = this.props;
    return barWidth - (handlePosition-minX) + handleWidth
  }
  
  calcRightBarStart = (handlePosition) => {
    const { minX, handleWidth } = this.props;
    return handlePosition-minX + handleWidth;
  }

  render() {
    const barClasses = [c.PageIndicatorBar];

    return (
      <div ref={this.props.elementRef} style={this.props.style} className={barClasses.join(' ')}>
        <div ref={this.leftBarRef} className={c.PageIndicatorBar_left}></div>
        <div ref={this.rightBarRef} className={c.PageIndicatorBar_right}></div>
      </div>
    );
  }
}

PageIndicatorBar.propTypes = {
  style: PropTypes.object,
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  minX: PropTypes.number,
  resizing: PropTypes.bool,
  initLoaded: PropTypes.bool,
  handlePosition: PropTypes.number,
  barWidth: PropTypes.number.isRequired,
  handleWidth: PropTypes.number,
  handleDelay: PropTypes.number,
  toggleInitLoaded: PropTypes.func.isRequired,
  transitionDuration: PropTypes.number,
  calculateNewHandlePosition: PropTypes.func.isRequired,
  currentSlideIndex: PropTypes.number.isRequired,
  animating: PropTypes.bool.isRequired
}
 
export default PageIndicatorBar;