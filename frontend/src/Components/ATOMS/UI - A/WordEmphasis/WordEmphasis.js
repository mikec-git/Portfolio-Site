import React from 'react';
import c from './WordEmphasis.module.scss';

const wordEmphasis = (props) => {
  return (
    <span className={c.WordEmphasis}>
      {props.children}
    </span>
  );
}
 
export default wordEmphasis;