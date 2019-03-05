import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TimelineMax, Expo, Power4, Power2, TweenMax } from 'gsap';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AboutContent from '../../Components/ORGANISMS/About/About/About';
import Contact from '../../Components/ORGANISMS/About/Contact/Contact';
import ToggleBtn from '../../Components/ATOMS/About -A/ToggleBtn/ToggleBtn';
import c from './About.module.scss';
import * as u from '../../Shared/utility';

class About extends Component {
  state = { 
    animating: false,
    pageState: 'about'
  };
    
  aboutRef          = React.createRef();
  aboutContentRef   = React.createRef();
  contactRef        = React.createRef();
  contactLinksRef   = React.createRef();
  toggleTopRef      = React.createRef();
  toggleBottomRef   = React.createRef();

  componentDidMount() {
    this.aboutEl          = this.aboutRef.current;
    this.aboutContentEl   = this.aboutContentRef.current;
    this.contactEl        = this.contactRef.current;
    this.contactLinksEl   = this.contactLinksRef.current;
    this.toggleTopEl      = this.toggleTopRef.current;
    this.toggleBottomEl   = this.toggleBottomRef.current;
    
    this._isMounted   = true;    
    const appearAnim  = this.props.routeAnim.appear;

    // This indicates route wasnt loaded initially by client, but instead arriving from another route
    if(appearAnim && this[appearAnim]) {
      this.setState({ animating: true }, this[appearAnim]);
    }

    // Add all page event listeners...
    this.addEvents();

    // Specific zoom out/in tweens for nav open
    this.zoomTweensTo = new TimelineMax({paused: true});
    this.zoomTweensTo
      .to(this.aboutEl, 0.5, {autoAlpha: 0, ease: Power2.easeOut}, 0);

    // Initially set contact page to be invisible
    TweenMax.set(this.contactEl, {autoAlpha: 0});
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.animationCallback();
    this.props.removeFocus();
    this.removeEvents();
  }
  
  componentDidUpdate(prevProps) {
    const { page, routeAnim: { leave: leaveAnim }, navIsOpen } = this.props;
    const { page: prevPage, routeAnim: { leave: prevLeaveAnim }, navIsOpen: prevNavIsOpen } = prevProps;

    // Leave route if page changed
    if(!_.isEqual(page[0], prevPage[0]) && this._isMounted) { 
      this.setState({ animating: true }, this[leaveAnim]);
    }

    // If nav is open...
    if(navIsOpen && !prevNavIsOpen) {
      this.zoomTweensTo.progress(0).play();
      // If nav is closed...
    } else if(!navIsOpen && prevNavIsOpen && leaveAnim === prevLeaveAnim) {
      this.zoomTweensTo.progress(1).reverse();
    }
  }

  addEvents() {    
    this.debouncedResize = _.debounce(this.onPageResize, 400, {
      'leading': false,
      'trailing': true
    });

    window.addEventListener('wheel', this.mouseScrollHandler);
    // Debounce the resize function call to its last call within a 400ms interval
    window.addEventListener('resize', this.debouncedResize);
  }

  removeEvents() {    
    window.removeEventListener('wheel', this.mouseScrollHandler);
    window.removeEventListener('resize', this.debouncedResize);
  }
  
  // When component leave anim finished...
  onCompleteHandlerLeave = () => {
    this.props.animationCallback();
    this._isMounted && this.setState({ animating: false });
  }
  
  // When component arrive anim finished...
  onCompleteHandlerArrive = () => {
    this._isMounted && this.setState({ animating: false });
  }

  // Create new timelines for animations...
  createNewTimeline = (type) => {
    this.tl && this.tl.clear();
    if(type === 'appear') {
      this.tl = new TimelineMax({onComplete: this.onCompleteHandlerArrive});
    } else if(type === 'leave') {
      this.tl = new TimelineMax({onComplete: this.onCompleteHandlerLeave});
    }
  }

  // Appear animation during route change...
  appearTweens = (direction) => {
    this.createNewTimeline('appear');
    const params = {
      out: {
        main: {
          set: {z: -400, autoAlpha: 0},
          to: {z: 0, autoAlpha: 1}
        }
      }
    };
    
    this.tl
      .set(this.aboutContentEl, {...params[direction].main.set})
      .set(this.contactLinksEl, {autoAlpha: 0}, 0)
      .set(this.toggleBottomEl, {autoAlpha: 0}, 0)
      
      .delay(.5)
      .to(this.aboutContentEl, 0.8, {...params[direction].main.to, ease: Expo.easeOut}, 0)
      .to(this.aboutContentEl, 0.8, {autoAlpha: 1, ease: Expo.easeIn}, 0)
      .to(this.contactLinksEl, 0.5, {autoAlpha: 1, ease: Expo.easeIn}, 0.65 + 0.3)
      .to(this.toggleBottomEl, 1, {autoAlpha: 1, ease: Expo.easeIn});
  }

  // Leave animation during route change...
  leaveTweens = (direction) => {
    this.createNewTimeline('leave');
    const autoAlphaEaseOut = {autoAlpha: 0, ease: Expo.easeOut};
    const params = {
      in: {
        main: {z: -400}
      }
    };
    
    this.tl
      .to(this.aboutContentEl, 0.8, {...params[direction].main, ease: Expo.easeIn}, 0)
      .to(this.aboutContentEl, 1.25, {...autoAlphaEaseOut}, 0);
      
      if(this.state.pageState === 'about') {
        this.tl
          .staggerTo(this.aboutContentEl.children, 0.8, {z: -400, ease: Expo.easeIn}, 0, 0)
          .to(this.contactLinksEl, 0.75, {...autoAlphaEaseOut}, 0)
          .to(this.toggleBottomEl, 1, {...autoAlphaEaseOut}, 0);
      } else {
        this.tl
          .to(this.contactEl, 0.8, {...params[direction].main, ease: Expo.easeIn},0)
          .to(this.contactEl, 1, {...autoAlphaEaseOut},0)
          .to(this.toggleTopEl, 0.8, {...autoAlphaEaseOut}, 0);
    }
  }
  
  appearOut = () => {
    this.appearTweens('out');
  }

  leaveIn = () => {
    this.leaveTweens('in');
  }
  
  // Initializes new slide timeline each time it is run...
  initSlide = () => {
    this._isSliding = true;
    this.slideTl && this.slideTl.clear();
    this.slideTl = new TimelineMax();
  }
  
  // Slides page up to reveal contact page...
  slideUp = () => {
    this.winHeight = window.innerHeight;
    this.initSlide();
    this.slideTl
      .to(this.toggleBottomEl, 0.15, {autoAlpha: 0}, 0)
      .to(this.aboutContentEl, 1, {y: -this.winHeight, autoAlpha: 0, ease: Power4.easeInOut}, 0)
      .to(this.contactEl, 1, {y: -this.winHeight, autoAlpha: 1, ease: Power4.easeInOut}, 0)
      .call(() => this._isMounted && this.setState({ pageState: 'contact' }))
      .call(() => (this._isSliding = false))
      .set(this.toggleBottomEl, {autoAlpha: 0})
      .to(this.toggleTopEl, 1, {autoAlpha: 1});
  }
  
  // Slides page down to reveal about page...
  slideDown = () => {
    this.winHeight = window.innerHeight;
    this.initSlide();
      this.slideTl
        .to(this.toggleTopEl, 0.15, {autoAlpha: 0}, 0)
        .to(this.aboutContentEl, 1, {y: 0, autoAlpha: 1, ease: Power4.easeInOut}, 0)
        .to(this.contactEl, 1, {y: 0, autoAlpha: 0, ease: Power4.easeInOut}, 0)
        .call(() => this._isMounted && this.setState({ pageState: 'about' }))
        .call(() => (this._isSliding = false))
        .set(this.toggleTopEl, {autoAlpha: 0})
        .to(this.toggleBottomEl, 1, {autoAlpha: 1});
  }

  // Toggles state of page...
  togglePageStateHander = () => {    
    if(!this.props.navIsOpen && u.isWindowDesktop()) {
      // If on about page...
      if(this.state.pageState === 'about') {
        this.slideUp();
        // Allow user to focus text on contact page
        this.props.addFocus();
        // If on contact page...
      } else {
        this.slideDown();
        // Remove focus ability (performance)
        this.props.removeFocus();
      }
    }
  }

  mouseScrollHandler = (e) => {
    if(!this._isSliding && !this.props.navIsOpen && u.isWindowDesktop()) {
      this.winHeight = window.innerHeight;
      
      if(e.deltaY > 0 && this.state.pageState === 'about') {
        this.slideUp();
        this.props.addFocus();
      } else if(e.deltaY < 0 && this.state.pageState === 'contact') {
        this.slideDown();
        this.props.removeFocus();        
      }
    }
  }
  
  onPageResize = () => {
    TweenMax.set(this.toggleTopEl, {clearProps: 'all'});
    TweenMax.set(this.toggleBottomEl, {clearProps: 'all'});
    TweenMax.set(this.aboutContentEl, {clearProps: 'all'});
    TweenMax.set(this.contactEl, {clearProps: 'all'});

    if(this.state.pageState === 'about') {
      this.slideDown();
    } else if(this.state.pageState === 'contact' && u.isWindowDesktop()) {      
      this.slideUp();
    }
  }

  render() {
    return (
      <div ref={this.aboutRef} className={c.About} >
        <AboutContent
          elementRef={this.aboutContentRef}
          contactLinksRef={this.contactLinksRef}
          animating={this.state.animating}
          images={this.props.images} />
        <Contact 
          elementRef={this.contactRef}
          animating={this.state.animating}
          pageState={this.state.pageState} />
        <ToggleBtn 
          position='top'
          elementRef={this.toggleTopRef}
          pageState={this.state.pageState}
          togglePageState={this.togglePageStateHander} />
        <ToggleBtn 
          position='bottom'
          elementRef={this.toggleBottomRef}
          togglePageState={this.togglePageStateHander} />
      </div>
    );
  }
}

About.propTypes = {
  page: PropTypes.arrayOf(PropTypes.string).isRequired,
  routeAnim: PropTypes.object,
  animationCallback: PropTypes.func,
  addFocus: PropTypes.func.isRequired,
  removeFocus: PropTypes.func.isRequired,
  images: PropTypes.objectOf(PropTypes.object.isRequired).isRequired
}

const mapStateToProps = state => {
  return {
    images: state.ui.images   
  }
}
 
export default connect(mapStateToProps, null)(About);