import React from 'react';

import PropTypes from 'prop-types';
import c from './Description.module.scss';

const description = (props) => {
  const { context, text: propText } = props;
  let classesLetters  = [c.Description__Letters],
      classesMain     = [c.Description];
  
  if(context === 'portfolio') {
    classesMain.push(c.Description_portfolio);
    classesLetters.push(c.Description__Letters_portfolio);
  } 

  return (
    <p className={classesMain.join(' ')}>
      <span ref={props.elementRef} className={classesLetters.join(' ')}>
        {propText}
      </span>
    </p>
  );
}
 
description.propTypes = {
  context: PropTypes.string,
  text: PropTypes.string.isRequired,
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
}

export default description;