import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TimelineMax, Power2, Expo, Power1, TweenMax } from 'gsap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Hammer from 'hammerjs';

import TitleMain from '../../ATOMS/UI - A/TitleMain/TitleMain';
import Description from '../../ATOMS/UI - A/Description/Description';
import Role from '../../ATOMS/UI - A/Role/Role';
import Year from '../../ATOMS/UI - A/Year/Year';
import BgImage from '../../ATOMS/Project - A/BgImage/BgImage';
import Technologies from '../../MOLECULES/Portfolio - M/Technologies/Technologies';
import DetailsButtons from '../../MOLECULES/Portfolio - M/DetailsButtons/DetailsButtons';

import * as u from '../../../Shared/utility';
import c from './Project.module.scss';

class Project extends Component {
  state = { 
    animating: false
  };
  
  projectRef      = React.createRef();
  projectTextRef  = React.createRef();
  bgImageRef      = React.createRef();
  bgSubImageRef   = React.createRef();
  bgImageShapeRef = React.createRef();
  titleMainRef    = React.createRef();
  separatorRef    = React.createRef();
  yearRef         = React.createRef();
  descriptionRef  = React.createRef();
  roleRef         = React.createRef();
  codeBtnRef      = React.createRef();
  projectBtnRef   = React.createRef();
  techRef         = React.createRef();
  bgImagesRef     = React.createRef();

  componentDidMount() {
    this.projectEl      = this.projectRef.current;
    this.projectTextEl  = this.projectTextRef.current;
    this.titleMainEl    = this.titleMainRef.current;
    this.separatorEl    = this.separatorRef.current;
    this.yearEl         = this.yearRef.current;
    this.descriptionEl  = this.descriptionRef.current;
    this.roleEl         = this.roleRef.current;
    this.mainChildren   = this.titleMainEl.children;  
    this.codeBtnEl      = this.codeBtnRef.current;
    this.projectBtnEl   = this.projectBtnRef.current;
    this.techEl         = this.techRef.current;
    this.bgImagesEl     = this.bgImagesRef.current;
    
    this.routeChanged = false;
    this._isMounted   = true;
    this.winHeight    = window.innerHeight;
    this.winWidth     = window.innerWidth;
    
    const yearColorElements = [this.yearEl, this.roleEl, this.techEl];
    TweenMax.set(this.titleMainEl, {color: this.props.fontColor});
    TweenMax.set(this.descriptionEl, {color: this.props.descColor});
    TweenMax.set(yearColorElements, {color: this.props.yearColor});
    TweenMax.set(this.separatorEl, {backgroundColor: this.props.yearColor});

    const appearAnim    = this.props.routeAnim.appear;
    const { id, anim }  = this.props.animatingProject;
    
    // Create leave and appear tweens for route/project changes...
    this.tlLeave  = new TimelineMax({onComplete: this.props.onFinishLeave});
    this.tlAppear = new TimelineMax({onComplete: this.onCompleteHandlerAppear});

    // If this is a project-to-project transition...
    if(id.to && id.to === this.props.id && this.props.animating) {
      this.setState({ animating: true }, this[anim.appear]);
      // If this is a route-to-portfolio transition...
    } else if(appearAnim && this[appearAnim]) {
      this.setState({ animating: true }, this[appearAnim]);
      // If this is an initial page load...
    } else if(!this.props.navIsOpen) {
      this.addMouseMove();
    }
      
    // Custom zoom in/out animation...
    this.zoomTweens = new TimelineMax({paused: true});
    this.zoomTweens
      .to(this.projectTextEl, .25, {autoAlpha: 0, ease: Power2.easeInOut})
      .to(this.bgImagesEl, .65, {left: '50%', top: '50%', ease: Power2.easeInOut}, '-=0.5');
      
    this.addEvents();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.removeMouseMove();
    this.removeEvents();
  }

  componentDidUpdate(prevProps) {
    const { 
      projectScrollAmount: projScrollAmt, 
      animatingProject: { id: animProjectId, anim }, 
      routeAnim: { leave: leaveAnim },
      page,
      navIsOpen,
      id: curProjectId,
      animating
    } = this.props;

    const { 
      projectScrollAmount: prevProjScrollAmt, 
      routeAnim: { leave: prevLeaveAnim },
      page: prevPage, 
      navIsOpen: prevNavIsOpen 
    } = prevProps;

    const routeChanged  = !_.isEqual(page[0], prevPage[0]);
    this.winHeight  = window.innerHeight;
    this.winWidth   = window.innerWidth;

    // If nav is newly opened...
    if(navIsOpen && !prevProps.navIsOpen) {
      this.zoomTweens.progress(0).play();
      // If nav is closed...
    } else if(!navIsOpen && prevNavIsOpen && leaveAnim === prevLeaveAnim) {
      TweenMax.delayedCall(0.4, () => this.zoomTweens.progress(1).reverse());
    }

    // Needs this here since I preload images (not avail on inital mount)
    if(!this.bgImage && this.bgImageRef.current) {
      this.bgImage = this.bgImageRef.current;
    }
    
    if(!this.bgSubImage && this.bgSubImageRef.current) {
      this.bgSubImage  = this.bgSubImageRef.current;
    }

    if(!this.shape && this.bgImageShapeRef.current) {
      this.shape = this.bgImageShapeRef.current;
    }   
    
    if(this._isMounted) {
      // If the route is changing...
      if(routeChanged) {
        this.setState({ animating: true }, this[leaveAnim]);
        // If the project is changing to another project...
      } else if(animProjectId.from === curProjectId && animating && !this.state.animating) {
        this.setState({ animating: true }, this[anim.leave]);
      }
    }

    // Mouse scroll animation
    if(Math.abs(projScrollAmt) >= 0 && projScrollAmt !== prevProjScrollAmt) {
      this.onProjectScrolling(projScrollAmt);
    }

    if(navIsOpen && !prevNavIsOpen) {
      this.removeMouseMove();
    } else if(!navIsOpen && prevNavIsOpen) {
      this.addMouseMove();
    }
  }

  addEvents() {
    this.debouncedResize = _.debounce(this.onPageResize, 400, {      
      'leading': false,
      'trailing': true
    });
    this.swipeRightFunc = () => this.props.changeProject(null, 38);
    this.swipeLeftFunc = () => this.props.changeProject(null, 39);

    // Debounce the resize function call to its last call within a 400ms interval
    window.addEventListener("resize", this.debouncedResize);

    // Swipe functionality for mobile...
    this.hammer = new Hammer(this.projectEl);
    this.hammer.on('swiperight', this.swipeRightFunc);
    this.hammer.on('swipeleft', this.swipeLeftFunc);
  }

  removeEvents() {
    window.removeEventListener("resize", this.debouncedResize);
    this.hammer.off('swiperight', this.swipeRightFunc);
    this.hammer.off('swipeleft', this.swipeLeftFunc);
    this.hammer.destroy();
  }
  
  onProjectScrolling = (scroll) => {
    // Scrolls project contents with background
    if(!this.state.animating) {
      TweenMax.killTweensOf( this.projectEl, {x: true} );
      TweenMax.to( this.projectEl, 0.5, {x: -scroll} );
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

      TweenMax.killTweensOf(this.projectEl, { rotationX: true, rotationY: true });
      TweenMax.to(this.projectEl, 1, {rotationX: 0, rotationY: 0, ease: Power2.easeOut});  
    }
  }

  // Handles mobile device movement/rotation...
  gyroscopeHandler = (e) => {
    if(u.isWindowMobile()) {
      const xAxisPos = e.beta;
      const yAxisPos = e.gamma;
      
      const xRatio = ((xAxisPos - 40) / 60).toFixed(2);
      const yRatio = (yAxisPos / 35).toFixed(2);
      
      TweenMax.killTweensOf(this.projectEl, { rotationX: true, rotationY: true });
      TweenMax.to(this.projectEl, 0.75, { 
        rotationX: 5 * xRatio, 
        rotationY: 6 * -yRatio,
        ease: Power1.easeOut
      });
    }
  }
  
  // Handles mouse move interaction on desktop...
  mouseMoveHandler = (e) => {
    if(u.isWindowDesktop()) {
      const xPos = e.clientX;
      const yPos = e.clientY;
  
      const xRatio = ((xPos - (window.innerWidth / 2)) / (window.innerWidth / 2)).toFixed(2);
      const yRatio = ((yPos - (window.innerHeight / 2)) / (window.innerHeight / 2)).toFixed(2);
  
      TweenMax.killTweensOf(this.projectEl, { rotationX: true, rotationY: true });
      TweenMax.to(this.projectEl, 1.5, { 
        rotationX: -6 * yRatio, 
        rotationY: 6 * xRatio,
        ease: Power1.easeOut
      });
    }
  }

  // When project fully arrives into scene...
  onCompleteHandlerAppear = () => {
    // Change animating project values in app state to null...
    this.props.onComplete();
    this._isMounted && this.setState({ animating: false }, this.addMouseMove);
  }

  appearTweens = (direction) => {
    this.tlAppear.clear();
    const elementGroup  = [this.projectTextEl, this.codeBtnEl, this.techEl];
    const subImgAutoAlpha = this.props.id === 1 ? 0.65 : 1;
    const autoAlphaEaseIn = {autoAlpha: 1, ease: Power2.easeIn};

    const params = {
      top:    { set: {y: -this.winHeight}, to: {y: 0} },
      bottom: { set: {y: this.winHeight}, to: {y: 0} },
      left:   { set: {x: -this.winWidth}, to: {x: 0} },
      right:  { set: {x: this.winWidth}, to: {x: 0} },
      in:     { set: {z: 300}, to: {z: 0} }
    };
    
    if(this.projectBtnEl) {
      elementGroup.push(this.projectBtnEl);
    }

    this.tlAppear
      .delay(0.25)
      .set(this.projectEl, {...params[direction].set}, 0)
      .set([...elementGroup, this.bgImage, this.shape, this.bgSubImage], {autoAlpha: 0}, 0)
      .to(this.projectEl, 0.7, {...params[direction].to, ease: Power2.easeOut}, 0.65)
      .call(this.addMouseMove)
      .staggerTo(elementGroup, 0.7, {...autoAlphaEaseIn}, 0.05, '-=0.15')
      .to([this.bgImage, this.shape], 0.7, {...autoAlphaEaseIn}, 0.65)
      .to(this.bgSubImage, 0.7, {autoAlpha: subImgAutoAlpha, ease: Power2.easeIn}, 0.65);
  }

  leaveTweens = (direction) => {
    this.removeMouseMove();
    this.tlAppear.clear(); 
    const autoAlphaEaseIn = {autoAlpha: 0, ease: Expo.easeIn};
    const elementGroup  = [this.projectTextEl, this.codeBtnEl, this.techEl];
    const imageGroup = [this.bgImage, this.shape, this.bgSubImage];
    const params = {
      top:    { toMain: {y: -this.winHeight} },
      bottom: { toMain: {y: this.winHeight} },
      left:   { toMain: {x: -this.winWidth} },
      right:  { toMain: {x: this.winWidth} },
      out:    { toMain: {z: 300, y: 0, x: 0} }
    };

    if(this.projectBtnEl) {
      elementGroup.push(this.projectBtnEl);
    }
    
    this.tlLeave
      .to(this.projectEl, 0.6, {...params[direction].toMain, ease: Expo.easeIn}, 0)
      .to(elementGroup, 0.7, {opacity: 0, ease: Expo.easeOut}, 0)
      .to(imageGroup, 0.6, {...autoAlphaEaseIn}, 0);
  }

  appearTop     = () => this.appearTweens('top');
  appearBottom  = () => this.appearTweens('bottom');
  appearLeft    = () => this.appearTweens('left');
  appearRight   = () => this.appearTweens('right');
  appearIn      = () => this.appearTweens('in');
  leaveTop      = () => this.leaveTweens('top');
  leaveBottom   = () => this.leaveTweens('bottom');
  leaveLeft     = () => this.leaveTweens('left');
  leaveRight    = () => this.leaveTweens('right');
  leaveOut      = () => this.leaveTweens('out');

  onPageResize = () => {
    // Resets zoomTweens instance variable as it stores the previous DOM state
    this.zoomTweens = new TimelineMax({paused: true});
    this.zoomTweens
      .to(this.projectTextEl, .75, {autoAlpha: 0, ease: Power2.easeInOut})
      .to(this.bgImagesEl, .75, {left: '50%', top: '50%', ease: Power2.easeInOut}, '-=0.5');

    // Clear the props on the bg images and text since they also store the previous DOM state
    TweenMax.set([this.bgImagesEl, this.projectTextEl], {clearProps: 'all'});

    if(this.props.navIsOpen) {
      this.zoomTweens.play();
    } 
  }
    
  render() { 
    const { 
      details: { techList, shape, image, subImage, name, year, role, description }, 
      id } = this.props;
    
    let technologies = [];
    for (const tech in techList) {
      if(techList[tech]) {
        technologies.push(<Technologies 
          key={tech}
          techType={tech}
          techList={techList[tech]} />);
      }
    }

    return (
      <section ref={this.projectRef} className={c.Project}>
        <div ref={this.bgImagesRef} className={c.Project__Images}>
          <BgImage
            elementRef={this.bgImageRef}
            subImageRef={this.bgSubImageRef}
            shapeRef={this.bgImageShapeRef}
            id={id}
            shape={shape}
            image={image}
            subImage={subImage} />
        </div>
        <div ref={this.projectTextRef} className={c.Project__Text}>
          <div className={c.Project__Title}>
            <TitleMain
              elementRef={this.titleMainRef}
              context='portfolio'
              text={name}
              isNotSeparate />
            <span ref={this.separatorRef} className={c.Project__TitleSeparator}>
            </span>
            <div className={c.Project__YearRole}>
              <Year 
                elementRef={this.yearRef}
                context='portfolio'
                text={year} />
              <Role
                elementRef={this.roleRef}
                context='portfolio'
                text={role} />
            </div>
          </div>
          <Description
            elementRef={this.descriptionRef}
            context='portfolio'
            text={description} />
          <div ref={this.techRef} className={c.Project__Tech}>
            {technologies}
          </div>
          <div className={c.Project__Buttons}>
            <DetailsButtons
              codeBtnRef={this.codeBtnRef}
              projectBtnRef={this.projectBtnRef}
              details={this.props.details} />
          </div>
        </div>
      </section>
    );
  }
}

Project.propTypes = {
  id: PropTypes.number.isRequired,
  details: PropTypes.object.isRequired,
  fontColor: PropTypes.string.isRequired,
  descColor: PropTypes.string.isRequired,
  yearColor: PropTypes.string.isRequired,
  changeProject: PropTypes.func.isRequired,
  projectScrollAmount: PropTypes.number,
  animating: PropTypes.bool.isRequired,
  animatingProject: PropTypes.shape({
    anim: PropTypes.objectOf(PropTypes.string),
    id: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onFinishLeave: PropTypes.func.isRequired,
  routeAnim: PropTypes.shape({
    leave: PropTypes.string,
    appear: PropTypes.string,
  }).isRequired,
  navIsOpen: PropTypes.bool.isRequired
}
 
const mapStateToProps = state => {
  return {
    navIsOpen: state.ui.navIsOpen
  }
}

export default connect(mapStateToProps, null)(Project);