import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { Expo, TimelineMax } from 'gsap';
import assetsLoader from 'assets-loader';
import PropTypes from 'prop-types';

import ProgressLogo from '../ProgressLogo/ProgressLogo';
import * as UIActions from '../../../../Store/Actions/UIActions';
import c from './ProgressBar.module.scss';

class ProgressBar extends PureComponent {
  state = {
    loadInit: false,
    loadComplete: false,
    smoothLoadComplete: false,
    isMounted: true,
    progress: 0,
    smoothProgress: 0
  }

  barRef  = React.createRef();
  logoRef = React.createRef();
  animFrameId = null;

  componentDidMount() { 
    this.barEl  = this.barRef.current;
    this.logoEl = this.logoRef.current;

    // Make sure it only runs once per page load
    if(!this.state.loadInit) {
      this.setState({ loadInit: true }, () => {
        const imgFiles = require.context('../../../../Assets/img', true, /\.(svg|png|jpg)$/);
        const imgs = this.progressCheck(imgFiles); 
        this.props.preLoadImages(imgs);
      });
    }
  }

  componentDidUpdate() {
    const { loadComplete, smoothLoadComplete, smoothProgress } = this.state;

    // If normal progress complete, smooth progress above 0.99, and all images loaded...
    if(loadComplete && !smoothLoadComplete && smoothProgress >= 0.99) {
      cancelAnimationFrame(this.animFrameId);
      // Sets progress to 100% and calls layout's assetsLoaded()  to load visible child...
      this.setState({ smoothProgress: 1, smoothLoadComplete: true }, () => {
        const progressTl = new TimelineMax();
        progressTl
          .set(this.barEl, {transformOrigin: 'center'})
          .to(this.barEl, 1, {scaleX: 0, ease: Expo.easeInOut})
          .call(() => this.setState({ isMounted: false }));
      });
    }
  }
  
  // Measure asset progress on page load
  progressCheck = (files) => {
    let imgs = {};
    let assets = [];

    // Iterate through the provided asset files (images here)
    files.keys().forEach(file => { 
      // Regex for images with specified file types
      const fileString = (/[\d\w-_]+\.(svg|png|jpg)$/).exec(file)[0];
      
      // Create new image object and load with src
      const image = new Image();
      image.src = files(file);
      imgs[fileString] = image;
      
      assets.push(files(file));
    });

    // Loads assets-loader with images to load
    assetsLoader({assets})
      .on('progress', (progress) => this.setState({ progress: +progress.toFixed(5) }))
      .on('complete', () => this.setState({ loadComplete: true }))
    .start();

    this.smoothOutProgressAmount();
    return imgs;
  }
  
  // Smooths out the progress so its not instantaneous and choppy
  smoothOutProgressAmount = () => {
    const {smoothProgress, progress, loadComplete } = this.state;
    
    // Calculates a smaller interval of progress growth
    const newAmount = smoothProgress + (progress - smoothProgress)*0.1;

    this.setState({ smoothProgress: newAmount }, () => {
      if(smoothProgress > 0.99 && loadComplete) {
        cancelAnimationFrame(this.animFrameId);
      } else {
        this.animFrameId = requestAnimationFrame(this.smoothOutProgressAmount);
      }
    });
  }

  render() {
    const barStyle  = { transform: `scaleX(${this.state.smoothProgress})` };
    const logoStyle = { opacity: `${this.state.smoothProgress}` }
    const { isMounted, smoothProgress } = this.state;
    const smoothPercentage = (smoothProgress*100).toFixed();

    return ( 
      <CSSTransition
        in={isMounted}
        mountOnEnter
        unmountOnExit
        timeout={750}
        classNames={{
          exit: c.ProgressBar_exit,
          exitActive: c.ProgressBar_exit_active,
          exitDone: c.ProgressBar_exit_done,
        }}
        onExiting={this.props.assetsLoaded} >
        <div className={c.ProgressBar}>
          <span className={c.ProgressBar__Percent}>
            {smoothPercentage}
          </span>
          <ProgressLogo 
            elementRef={this.logoRef}
            style={logoStyle}
            context='progressBar' />
          <span 
            style={barStyle} 
            ref={this.barRef} 
            className={c.ProgressBar__Bar}>
          </span>
        </div>
      </CSSTransition>
    );
  }  
}

ProgressBar.propTypes = {
  preLoadImages: PropTypes.func.isRequired,
  assetsLoaded: PropTypes.func.isRequired
}
 
const mapDispatchToProps = dispatch => {
  return {
    preLoadImages: (images) => dispatch(UIActions.preLoadImages(images))
  }
}

export default connect(null, mapDispatchToProps)(ProgressBar);