import React from 'react';
import PropTypes from 'prop-types';

import c from './Button.module.scss';

const button = (props) => {
  let btnClasses = [c.Button];

  if(props.color === 'blue3') {
    btnClasses.push(c.Button_blue3);
  } 

  return (
    <div 
      className={btnClasses.join(' ')}
      onClick={props.submitMail}>
      <span className={c.Button__Text}>
        {props.text}
      </span>
    </div>
  );
}

button.propTypes = {
  submitMail: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string
}
 
export default button;