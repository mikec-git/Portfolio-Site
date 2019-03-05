import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import _ from 'lodash';

import Layout from './HOC/Layout/Layout';
import Landing from './Containers/Landing/Landing';
import Portfolio from './Containers/Portfolio/Portfolio';
import About from './Containers/About/About';
import slides from './Components/ORGANISMS/ThreeJsBackground/slides';

import * as UIActions from './Store/Actions/UIActions';
import * as u from './Shared/utility';

class App extends Component {
  state = {
    pageAnimationCallback: null,
    animatingProject: {
      id: {
        from: null,
        to: null
      },
      anim: {
        leave: null,
        appear: null
      }
    },
    scrollAmount: 0
  };

  currentPage = [];
  currentAnim = {};
  
  // Deep checks and updates current page url
  pageCompare = memoizeOne(newPage => this.currentPage = newPage, _.isEqual);
  routeAnimationCompare = memoizeOne(newAnim => this.currentAnim = newAnim, _.isEqual);

  componentDidMount() {
    this.setViewHeightUnitForMobile();
    this.addEventListeners();
  }
  
  componentDidUpdate() {    
    if(this.backButtonHit) {
      this.backButtonHit = false;
      // When back button hit
      if(this.props.navIsOpen) {
        this.props.navToggleHandler();
      }
    }
  }

  // Required to get perfect 100vh on mobile
  setViewHeightUnitForMobile = () => {
    // Get 1% of viewport height
    let vh = window.innerHeight * 0.01;
    // Set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  addEventListeners = () => {
    window.addEventListener('mousedown', this.onDrag);
    window.addEventListener('mouseup', this.allowFocus);
    window.addEventListener('resize', this.setViewHeightUnitForMobile);
  }

  // Mouse drag select lags background, so only select via doubleclick
  onDrag = () => {
    window.addEventListener('mousemove', this.unFocusContentOnDrag);
  }

  // On mousedown, removes focus on content
  removeDragFocus = () => {
    window.addEventListener('mousedown', this.onDrag);
  }
  
  // On mousedown, allows focus on content
  addDragFocus = () => {
    window.removeEventListener('mousedown', this.onDrag);
  }

  allowFocus = () => {
    window.removeEventListener('mousemove', this.unFocusContentOnDrag);
  }

  unFocusContentOnDrag = () => {
    if(document.selection) {
      document.selection.empty();
    } else {
      window.getSelection().removeAllRanges();
    }
  }

  // Function to clear previous route in layout state
  setPageAnimationCallbackHandler = (func) => {
    this.setState({ pageAnimationCallback: func });
  }

  // Replaces memoized route anim if different
  changeRouteAnimationHandler = (from, to) => {
    const newAnim = u.routeAnimationStyle(from, to);
    newAnim && this.routeAnimationCompare(newAnim, this.currentAnim);
  }

  // Updates which projects are animating for portfolio page
  changeAnimatingProjectHandler = (animatingProject) => {
    this.setState({ 
      animatingProject: {...this.state.animatingProject, ...animatingProject} 
    });
  }

  // Sets new scroll amount for project page
  changeScrollAmountHandler = (scrollAmount) => {
    !this.props.navIsOpen && this.setState({ scrollAmount });
  }
  
  render() {
    const { history, location } = this.props;
    const { currentPage }       = this;
    const newPage = u.splitPathname(location.pathname);
    const from    = currentPage[0];
    const to      = newPage[0];
    
    // When hitting browser back button ...
    if(history.action === 'POP' && u.isArrayGt(currentPage, 0) && from !== to) {
      this.changeRouteAnimationHandler(from, to);
      this.backButtonHit = true;
    }

    // Compares the memoized page with new page, change if different
    this.pageCompare(newPage, currentPage);

    // Need to manually redirect due to AnimatedSwitch and Layout render setup...
    // IF path exists in slides AND if subroutes in the pathname...
    // OR if root path doesnt exist in slides...
    let redirect = null;
    let pageName = this.currentPage[0];
    if((slides[pageName] && this.currentPage.length > 1) || !slides[pageName]) {
      let redirectPath = null;
      redirectPath = !slides[pageName] ? '/' : `/${pageName}`;
      redirect = <Redirect to={redirectPath} />;
    } 

    return (
      <>      
        {redirect ? redirect : <Layout 
          page={this.currentPage}
          routeAnim={this.currentAnim}  
          setPageAnimationCallback={this.setPageAnimationCallbackHandler}
          changeScroll={this.changeScrollAmountHandler}
          changeRouteAnim={this.changeRouteAnimationHandler}
          animatingProject={this.state.animatingProject}
          scrollAmount={this.state.scrollAmount}
          navIsOpen={this.props.navIsOpen}
          images={this.props.images} >
          <Route 
            exact
            path='/' 
            render={ props => (
              <Landing 
                {...props} 
                page={this.currentPage}
                routeAnim={this.currentAnim}
                changeRouteAnim={this.changeRouteAnimationHandler}
                animationCallback={this.state.pageAnimationCallback}
                navIsOpen={this.props.navIsOpen} />
            )} />
          <Route 
            exact
            path='/portfolio' 
            render={ props => (
              <Portfolio 
                {...props} 
                navIsOpen={this.props.navIsOpen}
                page={this.currentPage}
                routeAnim={this.currentAnim}
                scrollAmount={this.state.scrollAmount}
                animatingProject={this.state.animatingProject}
                animationCallback={this.state.pageAnimationCallback}
                changeScroll={this.changeScrollAmountHandler}
                changeAnimatingProject={this.changeAnimatingProjectHandler} />
            )} />
          <Route 
            exact
            path='/about' 
            render={ props => (
              <About 
                {...props} 
                page={this.currentPage}
                navIsOpen={this.props.navIsOpen}
                routeAnim={this.currentAnim}
                animationCallback={this.state.pageAnimationCallback}
                addFocus={this.addDragFocus}
                removeFocus={this.removeDragFocus} />
            )} />
        </Layout>}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    navIsOpen: state.ui.navIsOpen,
    images: state.ui.images
  }
};

const mapDispatchToProps = dispatch => {
  return {
    navToggleHandler: () => dispatch(UIActions.toggleNav())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
