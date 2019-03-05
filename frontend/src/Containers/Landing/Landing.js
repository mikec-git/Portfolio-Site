import React, { Component } from 'react';
import { TimelineMax, TweenMax, Expo, Power1, Power2 } from 'gsap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Logo from '../../Components/ATOMS/UI - A/Logo/Logo';
import Hammer from 'hammerjs';

import TitleMain from '../../Components/ATOMS/UI - A/TitleMain/TitleMain';
import TitleSecondary from '../../Components/ATOMS/UI - A/TitleSecondary/TitleSecondary';
import LandingBtn from '../../Components/ATOMS/Landing - A/LandingBtn/LandingBtn';

import * as u from '../../Shared/utility';
import c from './Landing.module.scss';

class Landing extends Component {
  constructor(props) {
    super(props);
    const appearAnim = this.props.routeAnim && this.props.routeAnim.appear;
    const animating = appearAnim && this[appearAnim] ? true : false;
    this.state = { 
      descriptors: [
        'Developer',
        'Engineer',
        'Designer'
      ],
      animating: animating
    };
  }
   
  landingPageRef    = React.createRef();
  landingRef        = React.createRef();
  logoRef           = React.createRef();
  eyesRef           = React.createRef();
  landingBtnRef     = React.createRef();
  titleMainRef      = React.createRef();
  titleSecondaryRef = React.createRef();
    
  componentDidMount() {
    this.landingPageEl      = this.landingPageRef.current;
    this.landingEl          = this.landingRef.current;
    this.eyesEl             = this.eyesRef.current;
    this.landingBtnEl       = this.landingBtnRef.current;
    this.mainChildren       = this.titleMainRef.current.children;
    this.secondaryChildren  = this.titleSecondaryRef.current.children;
    this.logoEl             = this.logoRef.current;
    
    this.routeChanged = false;
    this._isMounted   = true;
    
    const appearAnim = this.props.routeAnim.appear;
    if(appearAnim && this[appearAnim]) {
      this.setState({ animating: true }, this[appearAnim]);
    } else {
      // Inidicates route scroll swap is now enabled
      this.toggleReady = true;
      this.addMouseMove();
    }

    this.addEvents();
  }

  componentWillUnmount() {
    this._isMounted = false;
    // Resets layout prevChild to null
    this.props.animationCallback();
    this.removeMouseMove();
    this.removeEvents();
  }
  
  componentDidUpdate(prevProps) {
    // Leave route
    const { routeAnim, page, navIsOpen } = this.props;
    const { page: prevPage, navIsOpen: prevNavIsOpen } = prevProps;

    this.winHeight  = window.innerHeight;

    if(!_.isEqual(page[0], prevPage[0]) && this._isMounted) { 
      this.setState({ animating: true }, this[routeAnim.leave]);
      this.removeMouseMove();
    }

    // If the navigation is open and mousemove is still enabled...
    if(this._isMouseMoving) {
      // If the nav is open, remove mouse move
      if(navIsOpen && !prevNavIsOpen) {
        this.removeMouseMove();
        TweenMax.to(this.landingBtnEl, 1, {opacity: 0, ease: Expo.easeOut});
      } 
      // Otherwise...
    } else {
      // If the nav is closed, add mouse move
      if(!navIsOpen && prevNavIsOpen) {
        this.addMouseMove();
        TweenMax.to(this.landingBtnEl, 1, {opacity: 1, ease: Expo.easeIn});
      }
    } 
  }

  addEvents() {
    this.swipeUpFunc = (e) => this.changeToPortfolioHandler(e);

    window.addEventListener('wheel', this.mouseScrollHandler);
    window.addEventListener('keydown', this.arrowkeyPressedHandler);
    // Used for swipe function on mobile
    this.hammer = new Hammer(this.landingPageEl);
    this.hammer.get('swipe').set({direction: Hammer.DIRECTION_VERTICAL});
    this.hammer.on('swipeup', this.swipeUpFunc);
  }

  removeEvents() {
    window.removeEventListener('wheel', this.mouseScrollHandler);
    window.removeEventListener('keydown', this.arrowkeyPressedHandler);
    this.hammer.off('swipeup', this.swipeUpFunc);
    this.hammer.destroy();
  }
  
  // If component leave anim finished...
  onCompleteHandlerLeave = () => {
    this.props.animationCallback();
    this._isMounted && this.setState({ animating: false });
  }
  
  // If component arrive anim finished...
  onCompleteHandlerArrive = () => {
    this._isMounted && this.setState({ animating: false }, this.addMouseMove);
  }

  // Handles route change to portfolio
  routeChangeHandler = (e, to) => {
    // Prevent multiple clicks which loads history stack unnecessarily
    if(this.routeChanged){
      e.preventDefault();
    } else {
      this.props.changeRouteAnim('landing', to);
      this.routeChanged = true;
    }
  }

  // Route change handler for key press down
  arrowkeyPressedHandler = (e) => {
    if(!this.props.navIsOpen && e.keyCode === 40) {
      this.changeToPortfolioHandler(e);
    }
  }
  
  // General route change for scroll
  changeToPortfolioHandler = (e) => { 
    this.routeChangeHandler(e, 'portfolio');
    if(!this.routeChangedScrolling) {
      this.props.history.push('/portfolio');
      this.routeChangedScrolling = true;
    }
  }

  // Create new timeline for route animation
  createNewTimeline = (type) => {
    this.tl && this.tl.clear();
    if(type === 'appear') {
      this.tl = new TimelineMax({onComplete: this.onCompleteHandlerArrive});
    } else if(type === 'leave') {
      this.tl = new TimelineMax({onComplete: this.onCompleteHandlerLeave});
    }
  }

  // Tweens for component appearing...
  appearTweens = (direction) => {
    this.createNewTimeline('appear');
    const params = {
      top: {
        logo: {
          set: {y: -this.winHeight, autoAlpha: 0},
          to: {y: 0, autoAlpha: 1}
        },
        main: {
          set: {y: -this.winHeight, autoAlpha: 0},
          to: {y: 0, autoAlpha: 1}
        },
        second: {
          set: {y: -this.winHeight/6, autoAlpha: 0},
          to: {y: 0, autoAlpha: 1}
        }
      },
      in: {
        logo: {
          set: {z: 200, autoAlpha: 0},
          to: {z: 0, autoAlpha: 1}
        },
        main: {
          set: {z: 200, autoAlpha: 0},
          to: {z: 0, autoAlpha: 1}
        },
        second: {
          set: {z: 200, autoAlpha: 0},
          to: {z: 0, autoAlpha: 1}
        }
      }
    };

    this.tl
      .set(this.mainChildren,       {...params[direction].main.set}, 0)
      .set(this.secondaryChildren,  {...params[direction].second.set}, 0)
      .set(this.logoEl,             {...params[direction].logo.set}, 0)
      .set(this.landingBtnEl,       {autoAlpha: 0}, 0)
      .set(this.eyesEl,             {autoAlpha: 0}, 0)
      .set(this.landingEl,          {rotationX: 0, rotationY: 0}, 0)
      
      .staggerTo(this.mainChildren, 0.8, {...params[direction].main.to, ease: Power1.easeOut}, 0.03, 0.65)
      .staggerTo(this.secondaryChildren, 0.8, {...params[direction].second.to, ease: Power1.easeOut}, 0.03, 0.65 + 0.2)
      .to(this.logoEl, 0.8, {...params[direction].logo.to, ease: Power1.easeOut}, 0.65)
      .call(() => (this.toggleReady = true))
      .to(this.landingBtnEl, .75, {autoAlpha: 1, ease: Power1.easeOut}, '+=0')
      .to(this.eyesEl, 1, {autoAlpha: 1, ease: Power1.easeIn}, '-=0.5');
  }

  // Tweens for component leaving...
  leaveTweens = (direction) => {
    this.createNewTimeline('leave');
    const params = {
      top: {
        logo:   {y: -600, autoAlpha: 0.4},
        main:   {y: -500, autoAlpha: 0},
        second: {y: -400,  autoAlpha: 0}
      },
      out: {
        logo:   {z: 200, autoAlpha: 0},
        main:   {z: 200, autoAlpha: 0},
        second: {z: 200, autoAlpha: 0}
      }
    };
    
    // To allow for earlier route change into portfolio via scroll
    this.toggleReady = false; 

    this.tl
      .to(this.landingEl, 0.6, {rotationX: 0, rotationY: 0}, 'landing')
      .to(this.logoEl, 0.6, {...params[direction].logo, ease: Expo.easeIn, overwrite: 'all'}, 'landing')
      .staggerTo(this.mainChildren, 0.6, {...params[direction].main, ease: Expo.easeIn, overwrite: 'concurrent'}, 0.01, 0)
      .staggerTo(this.secondaryChildren, 0.6, {...params[direction].second, ease: Expo.easeIn, overwrite: 'concurrent'}, 0.01, 0)
      .to(this.landingBtnEl, .65, {autoAlpha: 0, ease: Power1.easeOut, overwrite: 'concurrent'}, 'landing+=0.1');
  }

  appearTop = () => {
    this.appearTweens('top');
  }  
  
  appearIn = () => {
    this.appearTweens('in');
  }

  leaveTop = () => {
    this.leaveTweens('top');
  }

  leaveOut = () => {
    this.leaveTweens('out');
  }

  // Change route for mouse scroll down...
  mouseScrollHandler = (e) => {
    if(e.deltaY > 0 && this.toggleReady && !this.props.navIsOpen) {
      this.changeToPortfolioHandler(e);
    }
  }

  addMouseMove = () => {
    if(!this._isMouseMoving) {
      window.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('deviceorientation', this.gyroscopeHandler, true);
      this._isMouseMoving = true;
    }
  }
  
  removeMouseMove = () => {
    if(this._isMouseMoving) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      window.removeEventListener('deviceorientation', this.gyroscopeHandler);
      this._isMouseMoving = false;
    }
  }

  // Manages interaction with mobile tilt...
  gyroscopeHandler = (e) => {
    if(u.isWindowMobile()) {
      const xAxisPos = e.beta;
      const yAxisPos = e.gamma;
      
      const xRatio = ((xAxisPos - 40) / 60).toFixed(2);
      const yRatio = (yAxisPos / 35).toFixed(2);
      
      TweenMax.killTweensOf(this.landingEl, { rotationX: true, rotationY: true });
      TweenMax.to(this.landingEl, 0.75, { 
        rotationX: 5 * xRatio, 
        rotationY: 5 * -yRatio,
        ease: Power1.easeOut
      });
    }
  }

  // Manages interaction with mouseover on desktop...
  mouseMoveHandler = (e) => {
    if(u.isWindowDesktop()) {
      const xPos = e.clientX;
      const yPos = e.clientY;
  
      const xRatio = ((xPos - (window.innerWidth/2)) / (window.innerWidth/2)).toFixed(2);
      const yRatio = ((yPos - (window.innerHeight/2)) / (window.innerHeight/2)).toFixed(2);
  
      this.mouseTl && this.mouseTl.clear();
      this.mouseTl = new TimelineMax();
      this.mouseTl
        .to(this.landingEl, 1, {rotationX: -13*yRatio, rotationY: 15*xRatio, ease: Power1.easeOut})
        .to(this.landingEl, 1, {rotationX: 0, rotationY: 0, ease: Power2.easeIn});
    }
  }

  render() {
    return (
      <>
        <div 
          data-testid='landingPage'
          ref={this.landingPageRef} 
          className={c.Landing}>
          <div ref={this.landingRef} className={c.Landing__Details}>
            <Logo 
              elementRef={this.logoRef}
              eyesRef={this.eyesRef}
              images={this.props.images}
              context='landing' />
            <TitleMain 
              elementRef={this.titleMainRef}
              context='landing' 
              text='Mike Choi' />
            <TitleSecondary 
              animating={this.state.animating}
              elementRef={this.titleSecondaryRef}
              context='landing' 
              words={this.state.descriptors} />
          </div>
        </div>
        <LandingBtn
          elementRef={this.landingBtnRef}
          routeChange={this.routeChangeHandler} />
      </>
    );
  }
}

Landing.propTypes = {
  page: PropTypes.arrayOf(PropTypes.string).isRequired,
  routeAnim: PropTypes.shape({
    leave: PropTypes.string,
    appear: PropTypes.string,
  }).isRequired,
  changeRouteAnim: PropTypes.func.isRequired,
  animationCallback: PropTypes.func,
  navIsOpen: PropTypes.bool.isRequired,
  images: PropTypes.objectOf(PropTypes.object.isRequired).isRequired
}
 
const mapStateToProps = state => {
  return {
    images: state.ui.images
  }
}

export default connect(mapStateToProps, null)(Landing);