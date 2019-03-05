import React from 'react';
import PropTypes from 'prop-types';

import c from './Role.module.scss';

const role = (props) => {
  const { context, text: propText } = props;
  let classesLetters  = [c.Role__Letters],
      classesMain     = [c.Role];
  
  if(context === 'portfolio') {
    classesMain.push(c.Role_portfolio);
    classesLetters.push(c.Role__Letters_portfolio);
  }

  return (
    <p className={classesMain.join(' ')}>
      <span ref={props.elementRef} className={classesLetters.join(' ')}>
        {propText}
      </span> 
    </p>
  );
}
 
role.propTypes = {
  context: PropTypes.string,
  text: PropTypes.string.isRequired,
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
}

export default role;