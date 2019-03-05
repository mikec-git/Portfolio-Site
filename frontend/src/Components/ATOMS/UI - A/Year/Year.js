import React from 'react';
import PropTypes from 'prop-types';

import c from './Year.module.scss';

const year = (props) => {
  const { context, text: propText } = props;
  let classesLetters  = [c.Year__Letters],
      classesMain     = [c.Year];
  
  if(context === 'portfolio') {
    classesMain.push(c.Year_portfolio);
    classesLetters.push(c.Year__Letters_portfolio);
  }

  return (
    <p className={classesMain.join(' ')}>
      <span ref={props.elementRef} className={classesLetters.join(' ')}>
        {propText}
      </span> 
    </p>
  );
}
 
year.propTypes = {
  context: PropTypes.string,
  text: PropTypes.string.isRequired,
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
}

export default year;