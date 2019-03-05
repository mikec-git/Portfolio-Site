import React from 'react';
import PropTypes from 'prop-types';

import c from './ToggleBtn.module.scss';

const toggleBtn = (props) => {
  let btnText = null;
  let mainClasses = [c.ToggleBtn];
  let textClasses = [c.ToggleBtn__Text];
  
  // Toggle button config for sliding back to about page
  if (props.position === 'top') {
    btnText = 'Me, Myself, and I';
    mainClasses.push(c.ToggleBtn_top);
    textClasses.push(c.ToggleBtn__Text_top);
    // Toggle button config for sliding to contact form
  } else if(props.position === 'bottom') {
    mainClasses.push(c.ToggleBtn_bottom);
    btnText = `Let's Chat!`;
  }

  return (
    <div 
      className={mainClasses.join(' ')} 
      ref={props.elementRef}
      onClick={props.togglePageState} >
      <span className={textClasses.join(' ')}>{btnText}</span>
      <div className={c.ToggleBtn__Arrow}>
        <span></span>
        <span></span>
        <span></span>  
      </div>
    </div>
  );
}

toggleBtn.propTypes = {
  position: PropTypes.string.isRequired,
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  togglePageState: PropTypes.func.isRequired
}
 
export default toggleBtn;