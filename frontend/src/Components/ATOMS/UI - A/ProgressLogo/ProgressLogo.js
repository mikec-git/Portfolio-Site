import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '../Spinner/Spinner';
import logoBw from '../../../../Assets/img/logo_bw.svg';

import c from './ProgressLogo.module.scss';

const progressLogo = (props) => {
  let ref = null;
  let style = null;
  let imgClasses = [c.ProgressLogo__Image];
  let spinner = null;

  if(props.context === 'progressBar') {
    ref = props.elementRef;
    style = props.style;
    imgClasses.push(c.ProgressLogo__ProgressBar);
  } else if(props.context === 'contactForm') {
    imgClasses.push(c.ProgressLogo__ContactForm);
    spinner = <Spinner />;
  }

  return (
    <div 
      data-testid='progressLogo'
      className={c.ProgressLogo}>
      <img
        ref={ref} 
        style={style}
        className={imgClasses.join(' ')} 
        src={logoBw} 
        alt="White Logo"/>
      {spinner}
    </div>
  );
}

progressLogo.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  style: PropTypes.object,
  context: PropTypes.string
}
 
export default progressLogo;