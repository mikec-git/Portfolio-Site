import React, { Component } from 'react';
import PropTypes from 'prop-types';

import slides from '../../Components/ORGANISMS/ThreeJsBackground/slides';
import Project from '../../Components/ORGANISMS/Portfolio/Project';
import PageIndicator from '../../Components/MOLECULES/UI - M/PageIndicator/PageIndicator';

import * as u from '../../Shared/utility';
import c from './Portfolio.module.scss';
import { TweenMax, Expo, Power2 } from 'gsap';

class Portfolio extends Component {
  state = { 
    animating: true,
    pageAnimationCallback: null,
    curProject: slides.portfolio[0].projectId,
    showProjectIndex: slides.portfolio[0].projectId - 1,
    scrollAmount: 0
  };
  
  pageIndicatorRef  = React.createRef();
  maxProjectId      = slides.portfolio.length;
  slides            = slides.portfolio;

  componentDidMount() {
    this.pageIndicatorEl = this.pageIndicatorRef.current;
    this._isMounted = true;    

    if(!this.props.routeAnim.appear) {
      this.setState({ animating: false });
    } else {
      TweenMax.set(this.pageIndicatorEl, {autoAlpha: 0});
      TweenMax.to(this.pageIndicatorEl, 1, {autoAlpha: 1, ease: Power2.easeOut}).delay(1);
    }

    this.addEvents();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.animationCallback();

    const animatingProject = {
      id:   { from: null, to: null },
      anim: { leave: null, appear: null }
    };
    
    this.props.changeAnimatingProject(animatingProject);
    this.removeEvents();
  }

  componentDidUpdate(prevProps) {
    const { animationCallback, scrollAmount, navIsOpen, routeAnim } = this.props;
    const { 
      animationCallback: prevAnimCallback, 
      scrollAmount: prevScrollAmount, 
      navIsOpen: prevNavIsOpen,
      routeAnim: prevRouteAnim } = prevProps;

    if(animationCallback && !prevAnimCallback) {
      TweenMax.to(this.pageIndicatorEl, 0.5, {autoAlpha: 0, ease: Expo.easeOut});
    }

    if(scrollAmount !== prevScrollAmount && this._isMounted) {
      this.scrollHandler();
    }

    if(navIsOpen && !prevNavIsOpen) {
      TweenMax.to(this.pageIndicatorEl, 0.5, {autoAlpha: 0, ease: Expo.easeOut});
    } else if(!navIsOpen && prevNavIsOpen && routeAnim.leave === prevRouteAnim.leave) {
      TweenMax.to(this.pageIndicatorEl, 0.5, {autoAlpha: 1, ease: Expo.easeOut});
    }
  }

  addEvents() {
    window.addEventListener('wheel', this.scrollHandler);
    window.addEventListener('keydown', this.arrowkeyPressedHandler);
  }

  removeEvents() {
    window.removeEventListener('wheel', this.scrollHandler);
    window.removeEventListener('keydown', this.arrowkeyPressedHandler);
  }

  scrollHandler = (e) => {
    if(!this.props.navIsOpen) {
      this.projectScrollAmount = this.props.scrollAmount * 80;

      if(e && !this.state.animating) {
        const sign      = e.deltaY > 0 ? 2 : -2;
        const newScroll = sign + this.props.scrollAmount;
        this.props.changeScroll(newScroll);
      }
      
      // Down -> leave left | Up -> leave right
      if(this.projectScrollAmount > 300) {
        this.resetScrollAndInitiateLeave('down');
      } else if(this.projectScrollAmount < -300) {
        this.resetScrollAndInitiateLeave('up');
      }
    }
  }

  // Handles up/left and down/right keypresses for project change...
  arrowkeyPressedHandler = (e, code) => {
    if(!this.props.navIsOpen) {
      const keyCode = code || e.keyCode;
      
      // Project slides out left
      if(keyCode === 39 || keyCode === 40) {
        this.resetScrollAndInitiateLeave('down');
        // Project slides out right
      } else if(keyCode === 37 || keyCode === 38) {
        this.resetScrollAndInitiateLeave('up');
      }
    }
  }
  
  // Resets scrolled amount in state and leaves current project...
  resetScrollAndInitiateLeave = (direction) => {
    const curId = this.state.curProject;
    let toId = null;
    if(direction === 'down') {
      toId = curId === this.maxProjectId ? 1 : curId + 1;
    } else if(direction === 'up') {
      toId = curId === 1 ? this.maxProjectId : curId - 1;
    }
    this.leaveProjectHandler(null, toId, direction);
    this.projectScrollAmount = 0;
    this.props.changeScroll(0);
  }

  // Runs when current project initially leaving scene
  leaveProjectHandler = (e, toId, direction) => {
    if(e && e.target.textContent) {
      toId = e.target.textContent;
    }

    toId = toId ? +toId : null;
    const fromId = this.state.curProject;
    
    if(!this.state.animating && toId !== fromId && this._isMounted) {
      const dir       = toId > fromId ? 'down' : 'up';
      const scrollDir = direction || dir;
      
      this.projectAnimation = u.projectAnimationStyle(fromId, toId, scrollDir);

      const animatingProject = { 
        id:   { from: fromId, to: toId }, 
        anim: {...this.projectAnimation} 
      };

      this.props.changeAnimatingProject(animatingProject);
      this.setState({ animating: true, curProject: toId });
    }
  }

  // Called when current slide finishes leaving
  finishLeaveHandler = () => {
    if(this.state.animating && this._isMounted) {
      const newProject = this.state.curProject;
      this.setState({ showProjectIndex: newProject - 1 });
    }
    this.props.animationCallback && this.props.animationCallback();
  }

  // Called when new slide fully arrived
  completedAnimHandler = () => {
    const animatingProject = {
      id:   { from: null, to: null },
      anim: { leave: null, appear: null }
    };
    
    this.props.changeAnimatingProject(animatingProject);
    this._isMounted && this.setState({ animating: false });
  }

  render() {
    const projects = [];
    for (const project of this.slides) {
      projects.push(
        <Project
          key={project.projectId}
          id={project.projectId}
          details={project.details}
          fontColor={project.titleColor}
          descColor={project.descriptionColor}
          yearColor={project.yearColor}
          changeProject={this.arrowkeyPressedHandler}
          projectScrollAmount={this.projectScrollAmount}
          animating={this.state.animating}
          page={this.props.page}
          onComplete={this.completedAnimHandler}
          animatingProject={this.props.animatingProject}
          onFinishLeave={this.finishLeaveHandler}
          routeAnim={this.props.routeAnim} />
      );
    }

    const visibleProject = projects[this.state.showProjectIndex];
    
    return (
      <>
        <div className={c.Portfolio}>
          {visibleProject}
        </div>
        <PageIndicator 
          elementRef={this.pageIndicatorRef}
          numOfSlides={projects.length}
          animating={this.state.animating}
          changeProject={this.resetScrollAndInitiateLeave}
          currentSlide={this.slides[this.state.curProject-1]}
          currentSlideIndex={this.state.curProject}
          leaveProjectTo={this.leaveProjectHandler} />
      </>
    );
  }
}

Portfolio.propTypes = {
  navIsOpen: PropTypes.bool.isRequired,
  page: PropTypes.arrayOf(PropTypes.string).isRequired,
  routeAnim: PropTypes.shape({
    leave: PropTypes.string,
    appear: PropTypes.string,
  }).isRequired,
  scrollAmount: PropTypes.number.isRequired,
  animatingProject: PropTypes.shape({
    id: PropTypes.shape({
      from: PropTypes.number,
      to: PropTypes.number,
    }),
    anim: PropTypes.shape({
      leave: PropTypes.string,
      appear: PropTypes.string,
    }),
  }).isRequired,
  animationCallback: PropTypes.func,
  changeScroll: PropTypes.func.isRequired,
  changeAnimatingProject: PropTypes.func.isRequired
}

export default Portfolio;