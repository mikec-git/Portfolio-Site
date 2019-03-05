import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import c from './Logo.module.scss';

class Logo extends PureComponent {
  render() {
    let eyes = null;
    let mainClasses = [c.Logo];
    let eyeClasses  = [c.Logo__Eyes];
    const { images, eyesRef, context, elementRef } = this.props;
  
    if(context === 'landing') {
      mainClasses.push(c.Logo_landing);
      eyeClasses.push(c.Logo__Eyes_landing);
      eyes = (
        <span 
          ref={eyesRef}
          className={eyeClasses.join(' ')}>
        </span>
      );
    }

    const img = images['logo_transparent.svg'] ? images['logo_transparent.svg'].src : null;
    
    return (
      <div className={mainClasses.join(' ')}>
        <div ref={elementRef}>
          {eyes}
          <img className={c.Logo__Img} src={img} alt="Logo"/>
        </div>
      </div>
    );
  }
}
 
Logo.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  eyesRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  context: PropTypes.string,
  images: PropTypes.objectOf(PropTypes.object).isRequired
};

export default Logo;