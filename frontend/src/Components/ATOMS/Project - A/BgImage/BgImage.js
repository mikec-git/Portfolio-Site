import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import c from './BgImage.module.scss';

const bgImage = (props) => {
  let subImage    = null;
  let mainImage   = null;
  let shapeImage  = null;
  let shapeClasses = [c.BgImage__Shape];
  let imageClasses = [c.BgImage__Image];
  let subImageClasses = [c.BgImage__SubImage];

  if(props.id) {
    shapeClasses.push(c['BgImage__Shape_' + props.id]);
    imageClasses.push(c['BgImage__Image_' + props.id]);
    subImageClasses.push(c['BgImage__SubImage_' + props.id]);
  }

  if(props.images[props.image]) {
    mainImage = (
      <img 
        ref={props.elementRef}
        className={imageClasses.join(' ')} 
        src={props.images[props.image].src} 
        alt="Project Related"/>
    );
  }

  if(props.images[props.subImage]) {
    subImage = (
      <img 
        ref={props.subImageRef}
        className={subImageClasses.join(' ')} 
        src={props.images[props.subImage].src} 
        alt="Project Secondary"/>
    )
  }
  
  if(props.images[props.shape]) {
    shapeImage = (
      <img 
        ref={props.shapeRef}
        className={shapeClasses.join(' ')} 
        src={props.images[props.shape].src} 
        alt="Shape"/>
    );
  }

  return (
    <div className={c.BgImage}>
      {mainImage}
      {subImage}
      {shapeImage}
    </div>
  );
}

bgImage.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),  
  subImageRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),  
  shapeRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  id: PropTypes.number.isRequired,
  shape: PropTypes.string.isRequired,
  subImage: PropTypes.string.isRequired,
  images: PropTypes.objectOf(PropTypes.object.isRequired).isRequired
}

const mapStateToProps = state => {
  return {
    images: state.ui.images
  }
}
 
export default connect(mapStateToProps, null)(bgImage);