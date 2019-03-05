import React from 'react';
import PropTypes from 'prop-types';

import c from './ProjectButton.module.scss';

const projectButton = (props) => {
  let btnClasses = [c.ProjectButton];

  if(props.color === 'blue') {
    btnClasses.push(c.ProjectButton_blue);
  } else if(props.color === 'yellow') {
    btnClasses.push(c.ProjectButton_yellow);
  } else if(props.color === 'orange') {
    btnClasses.push(c.ProjectButton_orange);
  } else if(props.color === 'pink') {
    btnClasses.push(c.ProjectButton_pink);
  }

  return (
    <a 
      data-testid='projectBtn'
      ref={props.elementRef}
      href={props.url} 
      className={btnClasses.join(' ')} 
      data-text={props.text}
      rel='noreferrer noopener'
      target='_blank'>
      <span className={c.ProjectButton__Text}>
        {props.text}
      </span>
    </a>
  );
}

projectButton.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
};
 
export default projectButton;