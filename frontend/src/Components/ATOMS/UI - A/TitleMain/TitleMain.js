import React from 'react';
import PropTypes from 'prop-types';

import c from './TitleMain.module.scss';

const titleMain = (props) => {
  const { context, text: propText, elementRef, isNotSeparate } = props;
  let classesLetters  = [c.TitleMain__Letters],
      classesMain     = [c.TitleMain],
      text            = null;
      
  if(context === 'landing') {
    classesLetters.push(c.TitleMain__Letters_landing);
    classesMain.push(c.TitleMain_landing);
  } else if(context === 'portfolio') {
    classesLetters.push(c.TitleMain__Letters_portfolio);
    classesMain.push(c.TitleMain_portfolio);
  } else if(context === 'about') {
    classesLetters.push(c.TitleMain__Letters_about);
    classesMain.push(c.TitleMain_about);    
  } else if(context === 'contact') {
    classesLetters.push(c.TitleMain__Letters_contact);
    classesMain.push(c.TitleMain_contact);    
  }

  if(isNotSeparate) {
    text = <span className={[...classesMain, ...classesLetters].join(' ')}>{propText}</span>
  } else if(propText && propText.length > 0) {
    const splitWord = propText.split('');
    
    text = splitWord.map((letter, index) => {
      return letter === ' ' ? 
        <span key={index} className={c.TitleMain__Letter}>&nbsp;</span> : 
        <span key={index} className={c.TitleMain__Letter}>{letter}</span>;
    });
  }

  return (
    <h1 className={classesMain.join(' ')}>
      <span ref={elementRef} className={classesLetters.join(' ')}>
        {text}
      </span>
    </h1>
  );
}

titleMain.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  isNotSepatate: PropTypes.bool,
  context: PropTypes.string,
  text: PropTypes.string.isRequired
}

export default titleMain;