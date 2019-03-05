import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { TweenMax, TimelineMax, Expo, Power1, Power2, Elastic } from 'gsap';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import _ from 'lodash';

import c from './ThreeJsBackground.module.scss';
import * as util from './utility';
import * as u from '../../../Shared/utility';
import slides from './slides.js';

import * as routeActions from '../../../Store/Actions/RouteActions';

class ThreeJsBackground extends Component {
  threeWrapper  = React.createRef();
  THREE         = THREE;
  memoizedShapeMaterials  = {};
  memoizedShapes          = {};
  memoizedNoiseBg     = null;
  memoizedNoiseSphere = null;
  memoizedLights      = null;
  cameraZ = 15;

  componentDidMount() {
    this.threeBackground = this.threeWrapper.current;
    this.init();
    this.animate();
  }

  componentDidUpdate(prevProps) {
    const { page, routeAnim, animatingProject: { id, anim }, navIsOpen } = this.props;
    const { page: prevPage, animatingProject: { id: prevId }, navIsOpen: prevNavIsOpen } = prevProps;

    // If route is changing...
    if(!_.isEqual(page, prevPage) && routeAnim.leave) {
      const from = prevPage[0];
      this[routeAnim.leave](from);
      // If project is changing on portfolio page...
    } else if(page[0] === 'portfolio' && id.from !== prevId.from && anim.leave) {
      const from = page[0];
      this[anim.leave](from);
    }

    if(!this.bgAnimating) {
      if(navIsOpen && !prevNavIsOpen) {
        // Smooth out animation for noise sphere when nav opens and disable mouse interaction...
        if(this._hasNoiseSphere && this.noiseTl) {
          this.noiseTl.clear();
          this.noiseTl 
            .to(this.uniformsNoiseSphere.amplitude, 1, {value: 2 * Math.sin(this.sphere.rotation.y * 0.125)})
            .call(() => (this._mouseIsMoving = false));
        }
        this.zoomOut();
        // Otherwise if nav has closed...
      } else if(prevNavIsOpen && !navIsOpen) {
        this.zoomIn();
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animate);
    this.clearScene();
    this.removeEvents();
  }
  
  // INITIALIZE SCENE
  init() {
    // Set up three.js scene and camera
    this.scene  = new this.THREE.Scene();    
    this.camera = new this.THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.position.z = this.cameraZ;
    
    // Set up renderer
    this.renderer = new this.THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.threeBackground.appendChild( this.renderer.domElement );
    
    // Initialize scene and add events
    this.initCube();
    this.initBgColor(this.props.page[0]);
    this.initBackground(this.props.page[0]);
    this.addEvents();
  }

  // ANIMATION LOOP START
  animate = () => {
    this.rotateCamera();
    this.onMouseWheel();
    this.animateNoiseSphere();
    this.animateNoiseBg();
    this.renderBg();

    requestAnimationFrame( this.animate );
  }

  // Animates the particle noise background if active
  animateNoiseBg = () => {
    if(!this.bgAnimating && this._hasNoiseBg && !this.props.navIsOpen) {
      this.now    += 0.02;
      this.delta  = this.now - this.previousFrame;
      this.previousFrame = this.now;
  
      if(this.particles) {
        this.particles.rotation.x += 0.002;
        this.particles.rotation.y += 0.002;
        this.particles.rotation.z += 0.002;
      }
    }
  }

  // Animates the spiky noise sphere if active
  animateNoiseSphere = () => {
    let time = this.curTime * 0.009;
    this.curTime += 20;
    this.sphere.rotation.y = 0.01 * time; 
    this.sphere.rotation.z = 0.01 * time;
    let amplitude = this.uniformsNoiseSphere.amplitude;
    
    if(this._hasNoiseSphere && !this.props.navIsOpen) {
      // If mouse isnt interacting with screen...
      if(!this._mouseIsMoving && !this._mouseIsOver) {
        // Runs after mouse interaction or scene change to smooth sphere transition
        if(!this.sphereAnimSmooth && !this.sphereIsTweening) {
          this.sphereIsTweening = true;
          this.sphereTween = new TweenMax.to(amplitude, 3, {
            value: 2 * Math.sin(this.sphere.rotation.y * 0.125)
          });
          this.sphereTween.eventCallback("onComplete", () => {
            this.sphereAnimSmooth = true;
            this.sphereIsTweening = false;
          });
          // If the sphere is tweening, keep updating the end value
        } else if (this.sphereIsTweening) {
          this.sphereTween.updateTo({value: 2 * Math.sin(this.sphere.rotation.y * 0.125)}, false);
        } 
        
        // If the sphere is tweened and at its normal state...
        if(this.sphereAnimSmooth && !this.sphereIsTweening) {
          amplitude.value = 2 * Math.sin(this.sphere.rotation.y * 0.125);
        } 
        // Reset indicator to tween following mouse interaction
      } else if(this._mouseIsMoving && this._mouseIsOver) {
        this.sphereAnimSmooth = false;
      }

      // Animates color of sphere
      this.uniformsNoiseSphere.color.value.offsetHSL(0.0005, 0, 0);
      
      // Animates the amplitude displacement (spikes)
      for (let i = 0; i < this.displacementNoiseSphere.length; i++) {
        this.displacementNoiseSphere[i] = Math.sin(0.1 * i + time);
        this.noise[i] += 0.5 * (0.5 - Math.random());
        this.noise[i] = this.THREE.Math.clamp(this.noise[i], - 5, 4);
        this.displacementNoiseSphere[i] += this.noise[i];
      }
      
      this.sphere.geometry.attributes.displacement.needsUpdate = true;
    }
  }

  // REMOVE OBJECTS FROM MEMORY
  clearScene = (object = this.scene) => {
    while(object && object.children.length > 0) {
      this.clearScene(object.children[0]);
      object.remove(object.children[0]);
    }
    
    if(object.geometry) object.geometry.dispose();
    if(object.material) object.material.dispose();
    if(object.texture) object.texture.dispose();

    this._noiseBgInit     = false;
    this._hasNoiseBg      = false;
    this._hasNoiseSphere  = false;
  }

  // ADD OBJECTS TO SCENE
  addShapesToScene = (page, subPageId) => {
    // If all shapes have been initialized...
    if(this._shapesInit) {
      let subPage     = slides[page][subPageId];
      let pageKey     = subPage.name + subPageId;
      
      // Checks if subpage exists (0 for all, but projects 0-3)
      let hasSubPage  = typeof(subPageId) === 'number';
      let shapesExist = this.memoizedShapes.hasOwnProperty(pageKey);
      
      // Add shapes to scene if exists
      if(hasSubPage && shapesExist && this.memoizedShapes[pageKey].children.length > 0) {
        const clonedShapes = this.memoizedShapes[pageKey].clone();
        this.scene.add(clonedShapes);
      }
    } 
  }
  
  addNoiseBgParticlesToScene = (page) => {
    // Resets previous frame value and now indicator (was time value but was not consistent with what I needed)
    this.previousFrame  = 1e13 / 1000;
    this.now            = 1e13 / 1000;
    const slide = slides[page][0];
    
    // If the noise background is initialized and slide requests bg...
    if(this.memoizedNoiseBg) {
      if(slide.noiseBg) {
        // Clone + initialize particles and add to scene
        const noiseBgClone  = this.memoizedNoiseBg.clone();
        this.particles      = noiseBgClone;
        this.particles.name = page;
        this.scene.add(noiseBgClone);
        this._hasNoiseBg = true;
      }
    } 
  }

  addNoiseSphereToScene = (page) => {
    const slide = slides[page][0];
    // If noise sphere initialized and slide requests sphere...
    if(this.memoizedNoiseSphere) {
      if(slide.noiseSphere) {
        // Clone + initialize sphere and add to scene
        this.sphere       = this.memoizedNoiseSphere.clone();
        this.sphere.name  = page;
        this.sphere.position.set(7, 0, -25);
        this._hasNoiseSphere = true;
        this.scene.add(this.sphere);
      } 
    } 
  }

  // Adds lights to scene
  addLightToScene = () => this.scene.add(...this.memoizedLights);

  // INITIALIZING SCENE
  initCube() {
    // Cube is only used for manipulating the perspective of client's screen (and camera)
    let geometry = new this.THREE.BoxBufferGeometry( 0.1, 0.1, 0.1 );
    let material = new this.THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0} );
    this.cube = new this.THREE.Mesh( geometry, material );
    this.cube.position.set( 0,0,0 );
  }

  // Creates and saves all shapes and backgrounds, and makes first scene...
  initBackground = (page) => {
    this.memoizedLights   = util.createLights(this.THREE);    
    const noiseSphereVars = util.createNoiseSphere(this.THREE);
    const bgParticleVars  = util.createNoiseBgParticles(this.THREE, this.renderer);
    this._shapesInit      = util.createShapes(this.THREE, this.memoizedShapes);

    // Noise sphere variable initialization
    this.curTime = noiseSphereVars.curTime;
    this.uniformsNoiseSphere = noiseSphereVars.uniformsNoiseSphere;
    this.displacementNoiseSphere = noiseSphereVars.displacementNoiseSphere;
    this.noise = noiseSphereVars.noise;
    this.sphere = noiseSphereVars.sphere;
    this.memoizedNoiseSphere = noiseSphereVars.memoizedNoiseSphere;

    // Particle variable initialization
    this.uniformsNoiseBg = bgParticleVars.uniformsNoiseBg;
    this.particles = bgParticleVars.particles;
    this.gpuComputationRenderer = bgParticleVars.gpuComputationRenderer;
    this.variablePosition = bgParticleVars.variablePosition;
    this.random = bgParticleVars.random;
    this.memoizedNoiseBg = bgParticleVars.memoizedNoiseBg;
    
    const slide = slides[page];

    if(!slide) return;
    if(this.scene) this.clearScene();
    if(page) {
      this.addLightToScene();
      this.addShapesToScene(page, 0);
      slide[0].noiseSphere && this.addNoiseSphereToScene(page);
      slide[0].noiseBg && this.addNoiseBgParticlesToScene(page);
    }
  }

  // Sets bg color for page load...
  initBgColor = (page) => {
    const slide = slides[page];
    TweenMax.set(this.threeBackground, { backgroundColor: slide[0].backgroundColor });
  } 
  
  // START - ALL TRANSITION ANIMATIONS  
  addAllToScene = (to) => {
    // Need this since portfolio has multiple page IDs
    const portfolioToId = this.props.animatingProject.id.to;
    const subPageId = (to === 'portfolio' && portfolioToId) ? portfolioToId - 1 : 0;

    this.addNoiseBgParticlesToScene(to);
    this.addNoiseSphereToScene(to);
    this.addShapesToScene(to, subPageId);
    this.addLightToScene();

    return subPageId;
  }  
    
  // Selects scene objects to animate (based on certain characteristics)
  selectAnimatingObjects = (fromOrTo) => {
    const animObjectsMaterial = [];

    this.scene.traverse(node => {
      // If the name matches the page that is animating...
      if(node.name === fromOrTo) {
        // If children nodes exist...
        if(node.children.length > 0) {
          const meshArray = _.flattenDeep(node.children);
          // Collect materials of the meshes
          for(let i = 0; i < meshArray.length; i++) {
            meshArray[i].material && animObjectsMaterial.push(meshArray[i].material);
          }
          // Or if no children and node is a mesh/point...
        } else if(node.isMesh || node.isPoints) {
          node.material && animObjectsMaterial.push(node.material);
        }
      }
    });
    
    return animObjectsMaterial;
  }

  // Tweens the selected scene objects...
  tweenAnimatingObjects = (timeline, animatingObjectsMaterial, type) => {
    if(u.isArrayGt(animatingObjectsMaterial, 0) || this._hasNoiseBg || this._hasNoiseSphere) {
      let noiseObject = null;
      let noiseValue  = null;

      // Sets specific values for alpha (opacity) for each background type...
      if(this._hasNoiseBg) {
        noiseObject = this.uniformsNoiseBg;
        noiseValue = 0.5;
      } else if(this._hasNoiseSphere) {
        noiseObject = this.uniformsNoiseSphere;
        noiseValue = 1;
      }

      if(type === 'appear') {
        timeline
          .set(animatingObjectsMaterial, {transparent: true, opacity: 0, overwrite: 'none'}, 0)
          .staggerTo(animatingObjectsMaterial, 0.7, {opacity: 1, ease: Power2.easeIn, overwrite: 'none'}, 0, 0.65);

        noiseObject && timeline
          .set(noiseObject.alpha, {value: 0}, 0)
          .to(noiseObject.alpha, 0.7, {value: noiseValue, ease: Power2.easeIn}, 0.65);

      } else if(type === 'leave') {
        timeline
          .set(animatingObjectsMaterial, {transparent: true}, 0)
          .staggerTo(animatingObjectsMaterial, 0.6, {opacity: 0, ease: Power2.easeIn, overwrite: 'concurrent'}, 0, 0);
        
        noiseObject && timeline
          .to(noiseObject.alpha, 0.6, {value: 0, ease: Power2.easeIn}, 0);
      }
    }
  }

  // Resets scene and tweens to prepare for new animation
  resetAnimationAndScene = (type) => {
    this.tl && this.tl.kill();
    this.noiseTl && this.noiseTl.clear();
    this.bgAnimating = true;
    
    // If scene is zoomed out...
    if(this._zoomedOut) {
      const leaveAnim = this.props.routeAnim.leave;

      // If leave animation is NOT in/out...
      if(leaveAnim !== 'leaveIn' && leaveAnim !== 'leaveOut') {
        this.zoomIn(true);
      }

      // If noise sphere is active...
      if(this._hasNoiseSphere && this.noiseTl) {
        // Reset amplitude smoothly...
        this.noiseTl.clear();
        this.noiseTl
          .to(this.uniformsNoiseSphere.amplitude, 0.5, {value: 2 * Math.sin(this.sphere.rotation.y * 0.125)})
          .call(() => (this._mouseIsMoving = false));
      }
    }
    // Prevent any mouse movement while animating
    this.removeMouseMove();
    
    // Sets corresponding timelines with callbacks...
    if(type === 'appear') {
      this.clearScene();
      this.tl = new TimelineMax({onComplete: this.slideArrivedHandler});
    } else if(type === 'leave') {      
      this.tl = new TimelineMax({onComplete: this.completeRouteAnimationHandler});
    } 
  }

  // Zoom out scene
  zoomOut = () => {
    this._zoomedOut = true;
    this.removeMouseMove();
    const zPos = this._hasNoiseBg ? 18 : this._hasNoiseSphere ? 70 : 30;
    
    this.tl = new TimelineMax();
    this.tl.to(this.camera.position, 0.7, {z: zPos, ease: Power2.easeInOut}, 0);
  }
  
  // Zoom in scene
  zoomIn = (isRouteChange) => {
    this._zoomedOut = false;
    this.tl = new TimelineMax();
    this.tl.to(this.camera.position, 0.7, {z: this.cameraZ, ease: Power2.easeOut}, 0);

    // If route is not changing, add mouse move after zoom in
    if(!isRouteChange) {
      this.tl.call(() => this.addMouseMove());
    }
  }

  // Runs tweens for each appear direction and destination page
  appearTweens = (direction, to) => {
    this.resetAnimationAndScene('appear');
    const subPageId = this.addAllToScene(to);
    const animatingObjectsMaterial = this.selectAnimatingObjects(to);

    const distSide = 80;
    const dist = 30;
    const bgColor = slides[to][subPageId].backgroundColor;
    const params = {
      top:    { set: {x: 0, y: -dist},        to: {y: 0} },
      bottom: { set: {x: 0, y: dist},         to: {y: 0} },
      left:   { set: {y: 0, x: distSide},     to: {x: 0} },
      right:  { set: {y: 0, x: -distSide},    to: {x: 0} },
      in:     { set: {z: -dist/4, y: 0, x: 0},  to: {z: 0}, camTo: {z: this.cameraZ} },
      out:    { set: {z: dist*4, y: 0, x: 0},   to: {z: 0}, camTo: {z: this.cameraZ} }
    };

    this.tl
      .set(this.camera.position,    {...params[direction].set}, 0)
      .set(this.cube.position,      {...params[direction].set}, 0)
      .to(this.threeBackground, 1, {backgroundColor: bgColor, ease: Power1.easeInOut}, 0);

    if(direction !== 'out' && direction !== 'in') {
      this.tl
        .delay(0.25)
        .to(this.camera.position, 0.7, {...params[direction].to, ease: Power1.easeOut}, 0.65)
        .to(this.cube.position, 0.7, {...params[direction].to, ease: Power1.easeOut}, 0.65);
    } else {
      this.tl
        .delay(0.25)
        .to(this.camera.position, 1, {...params[direction].camTo, ease: Power1.easeOut}, 0.65)
        .to(this.cube.position, 1, {...params[direction].to, ease: Power1.easeOut}, 0.65);
    }

    this.tweenAnimatingObjects(this.tl, animatingObjectsMaterial, 'appear');
  }

  // Runs tweens for each leave direction and origin page
  leaveTweens = (direction, from) => {
    this.props.toggleRouteIsSliding(true);
    this.resetAnimationAndScene('leave');
    const animatingObjectsMaterial = this.selectAnimatingObjects(from);
    const distSide = 80;
    const dist = 30;

    const params = {
      top:    { to: {y: -dist}, reset: {x: 0} },
      bottom: { to: {y: dist},  reset: {x: 0} },
      left:   { to: {x: distSide},  reset: {y: 0} },
      right:  { to: {x: -distSide}, reset: {y: 0} },
      in:     { to: {z: dist*3},  reset: {y: 0, x:0} },
      out:    { to: {z: -dist/4}, reset: {y: 0, x:0} }
    };
    
    this.tl
      .to(this.camera.position, 0.6, {...params[direction].to, ease: Expo.easeIn}, 0)
      .to(this.cube.position, 0.6,  {...params[direction].to, ease: Expo.easeIn}, 0)

    this.tweenAnimatingObjects(this.tl, animatingObjectsMaterial, 'leave');
  }

  appearTop     = (to) => this.appearTweens('top', to);
  appearBottom  = (to) => this.appearTweens('bottom', to);  
  appearLeft    = (to) => this.appearTweens('left', to);
  appearRight   = (to) => this.appearTweens('right', to);
  appearIn      = (to) => this.appearTweens('in', to);
  appearOut     = (to) => this.appearTweens('out', to);
  leaveTop      = (from) => this.leaveTweens('top', from);
  leaveBottom   = (from) => this.leaveTweens('bottom', from);
  leaveLeft     = (from) => this.leaveTweens('left', from);  
  leaveRight    = (from) => this.leaveTweens('right', from);
  leaveIn       = (from) => this.leaveTweens('in', from);
  leaveOut      = (from) => this.leaveTweens('out', from);

  // Called when bg has fully arrived into scene...
  slideArrivedHandler = () => {  
    this.bgAnimating = false;
    this.addMouseMove();
    this.props.toggleRouteIsSliding(false);
    this.projectIsMouseScrollSliding = false;
  }

  // Runs once page has left scene, initializes the arrival animation
  completeRouteAnimationHandler = () => {
    let appearAnim    = this.props.routeAnim.appear;
    const projectAnim = this.props.animatingProject.anim;
    const to          = this.props.page[0];
    
    // For projects, the animations vary left and right too
    if(projectAnim.appear && to === 'portfolio') {
      appearAnim = projectAnim.appear;
    }

    this[appearAnim](to);
    // Sets background animating state to false in layout
    this.props.onAnimationFinished();
  }
  // END - ALL TRANSITION ANIMATIONS

  onMouseWheel = () => {
    // If route is changing, set mouse scroll to 0
    const scrollAmount = this.props._isSliding ? 0 : this.props.scrollAmount;

    // If current page is still portfolio and slide isn't moving...
    if(this.props.page[0] === 'portfolio' && !this.props._isSliding) {
      const oldScrollAmount = scrollAmount/1.3;
      // Some funky math, just from playing around with numbers
      let newScrollAmount   = +(oldScrollAmount - oldScrollAmount/100).toFixed(4);
          newScrollAmount   = Math.max(-20, Math.min(20, newScrollAmount));

      // If mouse scrolling is insignificant, set scrolled amount to 0...
      if(Math.abs(newScrollAmount) < 0.01) {
        this.projectIsMouseScrollSliding = false;
        newScrollAmount = 0;
      }
      
      // If the new scroll amount is different...
      if(oldScrollAmount !== newScrollAmount) {
        // Change scrolled amount to new amount
        this.props.changeScroll(newScrollAmount);
        this.projectIsMouseScrollSliding = true;
        
        // Slide horizontally by new scroll amount
        TweenMax.killTweensOf(this.camera.position, {x: true});
        TweenMax.killTweensOf(this.cube.position, {x: true});
        TweenMax.to(this.camera.position, 0.5, {x: newScrollAmount, ease: Power1.EaseOut});
        TweenMax.to(this.cube.position, 0.5, {x: newScrollAmount, ease: Power1.EaseOut});
      }
    }
  }
  
  gyroscopeHandler = (e) => {
    const xAxisPos = e.beta;
    const yAxisPos = e.gamma;
    
    const xRatio = ((xAxisPos - 40) / 60).toFixed(2);
    const yRatio = (yAxisPos / 35).toFixed(2);
    
    let xCamPos = (yRatio*Math.PI*0.5).toFixed(4);
    let yCamPos = (-xRatio*Math.PI*0.5).toFixed(4);
    
    // If the current page doesnt have bg noise particles...
    if(!this._hasNoiseBg) {
      // Move around bg following the mouse
      if(!this.projectIsMouseScrollSliding) {
        TweenMax.killTweensOf(this.camera.position, {x: true});
        TweenMax.to(this.camera.position, 0.75, {x: xCamPos});
      }
      
      TweenMax.killTweensOf(this.camera.position, {y: true});
      TweenMax.to(this.camera.position, 0.75, {y: yCamPos});
    }
  }

  // Mouse move handler...
  onMouseMove = (e) => {
    if(u.isWindowDesktop()) {
      const xNormalized = +( e.clientX / window.innerWidth).toFixed(3) - 0.5,
            yNormalized = +(-e.clientY / window.innerHeight).toFixed(3) + 0.5;
      
      let xCamPos = (-xNormalized*Math.PI*0.65).toFixed(2);
      let yCamPos = (-yNormalized*Math.PI*0.65).toFixed(2);
      
      // If the current page doesnt have bg noise particles...
      if(!this._hasNoiseBg) {
        // Move around bg following the mouse
        if(!this.projectIsMouseScrollSliding) {
          TweenMax.killTweensOf(this.camera.position, {x: true});
          TweenMax.to(this.camera.position, 1.5, {x: xCamPos});
        }
        
        TweenMax.killTweensOf(this.camera.position, {y: true});
        TweenMax.to(this.camera.position, 1.5, {y: yCamPos});
      }
      
      // If nav is closed...
      if(!this.props.navIsOpen) {
        this.noiseTl && this.noiseTl.clear();
        this.noiseTl = new TimelineMax();

        // For Noise Sphere
        if(this._hasNoiseSphere) {
          this._mouseIsMoving = true;
          // Calculates mouse position relative to radius from center of screen
          const mouseRadius = this.calcMousePosRadius(e, 1);
          this.noiseTl
            .to(this.uniformsNoiseSphere.amplitude, 0.25, {value: mouseRadius * 1.55})
            .call(() => (this._mouseIsMoving = false))
            .to(this.camera.position, 1, {x: 0, y: 0, ease: Power2.easeIn});
        } 
      }
    }
  };

  // 1 - greater value closer to center
  // Anything else - smaller value closer to center
  calcMousePosRadius = (e, type) => {
    const centerY = window.innerHeight/2,
          centerX = window.innerWidth/2,
          mouseFromCenterX = Math.abs(e.clientX - centerX),
          mouseFromCenterY = Math.abs(e.clientY - window.innerHeight/2),
          maxRadius   = Math.sqrt(Math.pow(centerY,2) + Math.pow(centerX,2)),
          mouseRadius = Math.sqrt(Math.pow(mouseFromCenterY,2) + Math.pow(mouseFromCenterX,2));
    
    return type === 1 ?
      +((maxRadius - mouseRadius)/maxRadius).toFixed(4) :
      +((mouseRadius)/maxRadius).toFixed(4);
  }
  
  onMouseOver = () => this._mouseIsOver = true;
  onMouseOut = () => this._mouseIsOver = false;

  // RENDER AND DRAW BACKGROUND
  renderBg = () => {
    this.renderNoiseBg();
    this.renderer.render(this.scene, this.camera);
  }

  // Rendering noise bg for particle background
  renderNoiseBg = () => {
    if(this.gpuComputationRenderer && this._hasNoiseBg && !this.props.navIsOpen) {
      this.gpuComputationRenderer.compute();
      this.random[0] += 0.005;
      this.random[1] += 0.001;
      this.random[2] += 0.003;
      
      // Runs if smoothed animation finished for noise background...
      if(this._noiseBgInit && !this.bgAnimating) {
        this.variablePosition.material.uniforms.delta.value = Math.min(this.delta/3, 0.5); 
        this.uniformsNoiseBg.hue1.value = this.THREE.Math.clamp(Math.sin(this.random[0]), -0.45, 0.45);
        this.uniformsNoiseBg.hue2.value = this.THREE.Math.clamp(Math.sin(this.random[1]), -0.45, 0.45);
        this.uniformsNoiseBg.hue3.value = this.THREE.Math.clamp(Math.sin(this.random[2]), -0.45, 0.45);
        // On first landing on noise bg page...
      } else if(!this._noiseBgInit) {
        const noiseBgTl = new TimelineMax();
        noiseBgTl
          .to(this.variablePosition.material.uniforms.delta, 1, {value: Math.min(this.delta/3, 0.5), ease: Elastic.easeIn})
          .call(() => (this._noiseBgInit = true))
          .to(this.uniformsNoiseBg.hue1, 3, {value: this.THREE.Math.clamp(Math.sin(this.random[0]), -0.45, 0.45)}, 0)  
          .to(this.uniformsNoiseBg.hue2, 3, {value: this.THREE.Math.clamp(Math.sin(this.random[1]), -0.45, 0.45)}, 0)  
          .to(this.uniformsNoiseBg.hue3, 3, {value: this.THREE.Math.clamp(Math.sin(this.random[2]), -0.45, 0.45)}, 0);
      }

      this.particles.material.uniforms.texturePosition.value = this.gpuComputationRenderer
        .getCurrentRenderTarget(this.variablePosition).texture;
    }
  }
    
  // ON WINDOW RESIZE
  resize = () => {
    const width   = window.innerWidth,
          height  = window.innerHeight;
    
    this.renderer.setSize( width, height );
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  // Camera follow mouse movement
  rotateCamera = () => this.camera.lookAt( this.cube.position );

  // ADD OR REMOVE EVENTS ON MOUNT/EJECT
  addEvents = () => {
    window.addEventListener( 'resize', _.debounce(this.resize, 200, {
      'leading': false,
      'trailing': true
    }));

    window.addEventListener( 'mousemove', this.onMouseMove );
    window.addEventListener( 'mouseover', this.onMouseOver );
    window.addEventListener( 'mouseout', this.onMouseOut );
    
    if(u.isWindowMobile()) {
      window.addEventListener('deviceorientation', this.gyroscopeHandler);
    }
  }
  
  removeEvents = () => {
    window.removeEventListener( 'resize', this.resize );
    window.removeEventListener( 'mousemove', this.onMouseMove );
    window.removeEventListener( 'mouseover', this.onMouseOver );
    window.removeEventListener( 'mouseout', this.onMouseOut );
    window.removeEventListener( 'deviceorientation', this.gyroscopeHandler );
  }
  
  addMouseMove = () => {
    window.addEventListener( 'mousemove', this.onMouseMove );
    if(u.isWindowMobile()) {
      window.addEventListener('deviceorientation', this.gyroscopeHandler);
    }
  }
  
  removeMouseMove = () => {    
    window.removeEventListener( 'mousemove', this.onMouseMove );
    window.removeEventListener( 'deviceorientation', this.gyroscopeHandler );
  }

  render() { 
    return <div className={c.ThreeJsBackground} ref={this.threeWrapper}></div>;
  }
}

ThreeJsBackground.propTypes = {
  page: PropTypes.arrayOf(PropTypes.string).isRequired,
  routeAnim: PropTypes.shape({
    leave: PropTypes.string,
    appear: PropTypes.string,
  }).isRequired,
  animatingProject: PropTypes.shape({
    anim: PropTypes.objectOf(PropTypes.string),
    id: PropTypes.objectOf(PropTypes.number),
  }).isRequired,
  scrollAmount: PropTypes.number.isRequired,
  changeScroll: PropTypes.func.isRequired,
  onAnimationFinished: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    _isSliding: state.route.routeIsSliding,
    navIsOpen: state.ui.navIsOpen
  }
};

const mapDispatchToProps = dispatch => {
  return {
    toggleRouteIsSliding: (toggleState) => dispatch(routeActions.toggleRouteSliding(toggleState))
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ThreeJsBackground));