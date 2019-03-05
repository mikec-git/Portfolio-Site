import React, { Component } from 'react';
import { TimelineMax, Power2 } from 'gsap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NavItems from '../../MOLECULES/Navigation - M/NavItems/NavItems';
import Hamburger from '../../ATOMS/Navigation - A/Hamburger/Hamburger';
import Backdrop from '../../ATOMS/UI - A/Backdrop/Backdrop';

import resume from '../../../Assets/pdf/resume.pdf';
import c from './Navigation.module.scss';
import * as UIActions from '../../../Store/Actions/UIActions';

class Navigation extends Component {
  state = {
    routes: [
      {
        to: '/',
        routeTo: 'landing',
        routeName: 'Home',
        id: 1
      },
      {
        to: '/portfolio',
        routeTo: 'portfolio',
        routeName: 'Portfolio',
        id: 2
      },
      {
        to: '/about',
        routeTo: 'about',
        routeName: 'About',
        id: 3
      },
      {
        isResume: true,
        routeName: 'Resume',
        resume: resume,
        id: 4
      },
    ],
    navIsSliding: false,
    navIsAnimating: false
  }

  hamburgerRef  = React.createRef();
  ringRef       = React.createRef();
  bgCircleRef   = React.createRef();
  navItemsRef   = React.createRef();
  layerRef      = [React.createRef(), React.createRef(), React.createRef()];

  componentDidMount() {
    this.hamburgerEl    = this.hamburgerRef.current;
    this.burgerLayersEl = Array.from(this.hamburgerEl.children).slice(0, 3);
    this.ringEl         = this.ringRef.current;
    this.bgCircleEl     = this.bgCircleRef.current;
    this.burgerLayerEl = [
      this.layerRef[0].current, 
      this.layerRef[1].current, 
      this.layerRef[2].current
    ];

    this.navTl        = new TimelineMax();
    this.burgerTl     = new TimelineMax();
    this._isMounted   = true;
    this.routeChanged = false;
  }

  componentDidUpdate(prevProps, prevState) {
    const { page, isSliding, navIsOpen } = this.props;
    const { page: prevPage, isSliding: prevIsSliding } = prevProps;
    const { navIsSliding, navIsAnimating } = this.state;
    const { navIsAnimating: prevNavIsAnimating } = prevState;

    if(page[0] === prevPage[0] && !isSliding && !navIsSliding) {
      this.routeChanged = false;
    } 

    // Need this here since nav items dont render until nav opened
    if(this.navItemsRef && this.navItemsRef.current) {
      this.navItemsEl = this.navItemsRef.current.children;
    }

    // Various stages of navigation animations...
    if(navIsAnimating && !prevNavIsAnimating) {
      this.navOpenCloseAnimations('clicked');
      
      if(navIsOpen) {
        this.navOpenCloseAnimations('opening');
      } else {
        this.navOpenCloseAnimations('closing');
      }
    } else if(!navIsAnimating && prevNavIsAnimating && navIsOpen) {
      this.navOpenCloseAnimations('openComplete');
    }

    if(isSliding && !prevIsSliding) {
      this.navBurgerSlidingAnimation('leave');
    } else if(!isSliding && prevIsSliding) {
      this.navBurgerSlidingAnimation('enter');
    }
  }

  componentWillUnmount() {
     this._isMounted = false;
  }

  // Hamburger menu animations during route/project change...
  navBurgerSlidingAnimation = (status) => {
    this.burgerTl.clear();
    if(status === 'leave') {
      this.setState({ navIsSliding: true });
      this.burgerTl
        .staggerTo(this.burgerLayersEl, 0.5, {width: 0, autoAlpha: 0}, 0.2, 0)
        .set(this.hamburgerEl, {autoAlpha: 0});
    } else if(status === 'enter') {
      this.burgerTl
        .set(this.hamburgerEl, {autoAlpha: 1})
        .staggerTo(this.burgerLayersEl, 0.5, {autoAlpha: 1, width: '100%'}, 0.2)
        .call(() => this.setState({ navIsSliding: false }));
    }
  }

  // Various navigation animation tweens...
  navOpenCloseAnimations = (status) => {
    this.navTl.clear();
    if(status === 'opening') {
      this.navTl
        .staggerTo(this.burgerLayerEl, 1, {backgroundColor: '#e50000', ease: Power2.easeInOut}, 0.2, 'burger')
        .to(this.ringEl, 1, {autoAlpha: 1, border: '2px solid #e50000', ease: Power2.easeInOut}, 'burger+=0.5');
    } else if(status === 'openComplete') {
      this.navTl
        .set(this.navItemsEl, {y: 50, autoAlpha: 0}, 0)
        .staggerTo(this.navItemsEl, 0.5, {y: 0, autoAlpha: 1}, 0.05, 0);
    } else if(status === 'closing') {
      this.navTl
        .to(this.ringEl, 0.5, {autoAlpha: 0, border: '2px solid #cccccc', ease: Power2.easeInOut}, 0)
        .staggerTo(this.burgerLayerEl, 0.5, {backgroundColor: '#cccccc', ease: Power2.easeInOut}, 0.2, 0)
        .staggerTo(this.navItemsEl, 0.25, {autoAlpha: 0}, -0.05, 0)
        .set(this.burgerLayerEl, {clearProps: 'all'});
    } else if(status === 'clicked') {
      this.navTl
        .set(this.bgCircleEl, {width: 0, height: 0}, 0)
        .to(this.bgCircleEl, 0.2, {backgroundColor: '#f2f2f2', width: "100%", height: "100%"}, 'burger')
        .set(this.bgCircleEl, {backgroundColor: 'transparent'});
    }
  }

  routeChangeHandler = (e, to) => {
    // Prevent multiple clicks which loads history stack unnecessarily 
    if(this.routeChanged || !this.props.navIsOpen){
      e.preventDefault();
    } else {
      const navToggleHandler = this.state.navIsAnimating ? null : this.props.navToggleHandler;
      navToggleHandler && navToggleHandler();
      if(this.props.page[0] !== to) {
        this.props.changeRouteAnim(this.props.page[0], to);
        this.routeChanged = true;
      }
    }
  }

  // Sets true/false if navigation is animating
  toggleNavAnimatingHandler = (navState) => {
    this.setState({ navIsAnimating: navState });
  }

  render() { 
    const navToggleHandler = this.state.navIsAnimating ? null : this.props.navToggleHandler;

    let burgerNavToggle = navToggleHandler;
    // Disable nav burger when transitioning
    if(this.props.isSliding || this.state.navIsSliding) {
      burgerNavToggle = null;
    }
    
    return (
      <nav className={c.Navigation}>
        <Hamburger
          elementRef={this.hamburgerRef}
          layerRef={this.layerRef}
          ringRef={this.ringRef}
          bgCircleRef={this.bgCircleRef}
          navIsOpen={this.props.navIsOpen}
          navToggle={burgerNavToggle} />
        <Backdrop
          isOpen={this.props.navIsOpen}
          backdropClicked={navToggleHandler}
          stateChanged={this.toggleNavAnimatingHandler} />
        <NavItems
          elementRef={this.navItemsRef}
          navIsOpen={this.props.navIsOpen}
          routeChange={this.routeChangeHandler}
          navRoutes={this.state.routes}
          toggleNav={navToggleHandler} />
      </nav>
    );
  }
}

Navigation.propTypes = {
  page: PropTypes.arrayOf(PropTypes.string).isRequired,
  changeRouteAnim: PropTypes.func.isRequired,
  navIsOpen: PropTypes.bool.isRequired,
  isSliding: PropTypes.bool.isRequired,
  navToggleHandler: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  return {
    isSliding: state.route.routeIsSliding,
    navIsOpen: state.ui.navIsOpen
  }
}

const mapDispatchToProps = dispatch => {
  return {
    navToggleHandler: () => dispatch(UIActions.toggleNav()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);