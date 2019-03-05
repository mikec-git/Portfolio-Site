import React, { PureComponent } from 'react';
import { TimelineMax, TweenMax, Power2 } from 'gsap';
import { Draggable } from 'gsap/all';
import PropTypes from 'prop-types';

import Handle from '../../../ATOMS/UI - A/Handle/Handle';
import PageIndicatorBar from '../../../ATOMS/UI - A/PageIndicatorBar/PageIndicatorBar';

import c from './PageIndicator.module.scss';

class PageIndicator extends PureComponent {
  state = {
    handlePosition: null,
    minX: null,
    initLoaded: false,
    resizing: false,
    currentSlideNum: null,
    barWidth: window.innerWidth * 0.25 * 2,
    bounds: window.innerWidth * 0.25 // Total Page is 50% of window width
  }

  handleRef       = React.createRef();
  handleProxyRef  = React.createRef();
  barRef          = React.createRef();
  slashRef        = React.createRef();
  pageNumberRef   = React.createRef();
  handleDelay         = 0.65;
  transitionDuration  = 1.3;

  componentDidMount() {
    this.tl = new TimelineMax();
    this.handleProxy  = this.handleProxyRef.current;
    this.handleEl     = this.handleRef.current;
    this.barEl        = this.barRef.current.children;
    this.slashEl      = this.slashRef.current;
    this.pageNumberEl = this.pageNumberRef.current;
    this.handleWidth  = this.handleEl.getBoundingClientRect().right - this.handleEl.getBoundingClientRect().left;

    this._isMounted = true;
    
    // Create a new GSAP Draggable element for the handle proxy...
    this.handle = Draggable.create(this.handleProxy, {
      type: 'x',
      lockAxis: 'x',
      cursor: 'pointer',
      bounds: {
        minX: -this.state.bounds - this.handleWidth/2, 
        maxX: this.state.bounds - this.handleWidth/2
      },
      onDragStart: this.onDrag,
      onDrag: this.onDrag,
      onDragEnd: this.onDragEnd,
      edgeResistance: 0.95
    })[0];

    // Set initial handle position and colors for indicator bar...
    this.setState({ 
      handlePosition: this.calculateNewHandlePosition(),
      minX: this.handle.minX
    }, () => {
      this.tl
        .set(this.handleProxy, {x: this.state.handlePosition}, 0)
        .set(this.handleEl, {x: this.state.handlePosition}, 0)
        .set([this.barEl, this.slashEl], {backgroundColor: this.props.currentSlide['descriptionColor']}, 0)
        .set([this.pageNumberEl, this.handleEl, this.slashEl], {color: this.props.currentSlide['descriptionColor']}, 0);
    });

    window.addEventListener('resize', this.pageResizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.pageResizeHandler);
    this._isMounted = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.animating && !prevProps.animating) {
      // If changing Pages...
      if(this.props.currentSlideIndex !== prevProps.currentSlideIndex) {
        this.handle.disable();
        const handlePosition = this.calculateNewHandlePosition();
        const barColor = this.props.currentSlide['descriptionColor'];
        
        // Animate handle/color transition according to appearing slide...
        this.tl && this.tl.clear();
        this.tl
          .to(this.handleProxy, this.transitionDuration, {x: handlePosition, ease: Power2.easeInOut, overwrite: 'all'})
          .to(this.handleEl, this.transitionDuration, {x: handlePosition, ease: Power2.easeInOut, overwrite: 'all'}, 0)
          .to(this.barEl, this.transitionDuration, {backgroundColor: barColor, ease: Power2.easeInOut}, 0.65)
          .to(this.slashEl, this.transitionDuration, {backgroundColor: barColor, ease: Power2.easeInOut}, 0)
          .to([this.pageNumberEl, this.handleEl], this.transitionDuration, {color: barColor, ease: Power2.easeInOut}, 0)
          .call(() => this._animComplete = true);

        if(this._isMounted) {
          this.setState({handlePosition, currentSlideNum: this.props.currentSlideIndex});
        }
      }
      // If window is resizing...
    } else if(this.state.resizing && prevState.resizing && this._isMounted) {
      this.setState({ resizing: false });
      // If indicator was animating but not anymore...
    } else if(!this.props.animating && prevProps.animating && this._animComplete) {
      this.handle.enable();
      this._animComplete = false;
    }
  }

  // When dragging the handle...
  onDrag = () => {
    if(this._isMounted) {
      // Updates handle number values and position...
      const newSlideNum = this.calculatePositionInterval();
      this.setState({handlePosition: this.handle.x, currentSlideNum: newSlideNum}, () => {
        TweenMax.to(this.handleEl, this.handleDelay, {x: this.handle.x, overwrite: 'all'});
      });
    }
  }
  
  onDragEnd = () => {
    // Interval width of each slide on the bar
    const newSlideNum = this.calculatePositionInterval();
    const newHandlePosition = this.calculateNewHandlePosition();
    if(this._isMounted) {
      this.setState({handlePosition: newHandlePosition, currentSlideNum: newSlideNum}, () => {
        this.props.leaveProjectTo(null, this.state.currentSlideNum);
        this.tl && this.tl.clear();
        this.tl
          .to([this.handleEl, this.handleProxy], this.handleDelay, {x: this.state.handlePosition, overwrite: 'all'}, 0, 0);
      });
    }
  }
  
  pageResizeHandler = () => {
    const bounds = window.innerWidth * 0.25;
    const barWidth = bounds * 2;

    const barInterval = barWidth / (this.props.numOfSlides-1);
    const minX = -bounds - this.handleWidth/2;
    const maxX = bounds - this.handleWidth/2;
    const handlePosition = minX + ((this.props.currentSlideIndex-1) * barInterval);

    if(this._isMounted) {
      this.setState({bounds, barWidth, minX, handlePosition, resizing: true}, () => {
        this.handle.applyBounds({ minX, maxX });
        this.tl && this.tl.clear();
        this.tl 
          .set(this.handleEl, {x: this.state.handlePosition})
          .set(this.handleProxy, {x: this.state.handlePosition}, 0);
      });
    }
  }

  // Calculates which page interval the handle is on...
  calculatePositionInterval = () => {
    const intervalWidth = this.state.barWidth / (this.props.numOfSlides-1);
    const dragPosition  = this.handle.x - (this.handle.minX - intervalWidth/2);
    const newSlideId    = Math.floor(dragPosition/intervalWidth);
    return Math.min(this.props.numOfSlides, Math.max(0, newSlideId)) + 1;
  }
  
  calculateNewHandlePosition = () => {
    const width = this.state.barWidth;
    const barInterval = width / (this.props.numOfSlides-1);
    return this.handle.minX + ((this.props.currentSlideIndex-1) * barInterval);
  }

  toggleInitLoaded = () => {
    if(this._isMounted) {
      this.setState({ initLoaded: true });
    }
  }
  
  render() {
    const style = { width: this.state.barWidth + 'px' };
    const indicatorWidth = { width: this.state.barWidth + this.handleWidth + 'px'};
    const currentSlideNum = this.state.currentSlideNum || this.props.currentSlideIndex;

    
    return (
      <>
        <Handle
          isMobile
          mobileNumRef={this.pageNumberRef}
          changeProject={this.props.changeProject}
          currentSlide={currentSlideNum} />
        <div ref={this.props.elementRef} style={indicatorWidth} className={c.PageIndicator}>
          <div 
            ref={this.handleProxyRef} 
            className={c.PageIndicator__HandleProxy}>
          </div>
          <Handle
            isDesktop
            elementRef={this.handleRef}
            slashRef={this.slashRef}
            totalSlides={this.props.numOfSlides}
            currentSlide={currentSlideNum}
            handleClass={c.PageIndicator__Handle}
            changeProject={this.props.changeProject} />
          <PageIndicatorBar 
            style={style}
            elementRef={this.barRef}
            minX={this.state.minX}
            resizing={this.state.resizing}
            initLoaded={this.state.initLoaded}
            handlePosition={this.state.handlePosition}
            barWidth={this.state.barWidth}
            handleWidth={this.handleWidth}
            handleDelay={this.handleDelay}
            toggleInitLoaded={this.toggleInitLoaded}
            transitionDuration={this.transitionDuration}
            calculateNewHandlePosition={this.calculateNewHandlePosition}
            currentSlideIndex={this.props.currentSlideIndex}
            animating={this.props.animating} />
        </div>
      </>
    );
  }
}
 
PageIndicator.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  numOfSlides: PropTypes.number.isRequired,
  animating: PropTypes.bool.isRequired,
  changeProject: PropTypes.func.isRequired,
  currentSlide: PropTypes.object.isRequired,
  currentSlideIndex: PropTypes.number.isRequired,
  leaveProjectTo: PropTypes.func.isRequired
};

export default PageIndicator;