import React from 'react';
import PropTypes from 'prop-types';

import WordEmphasis from '../../UI - A/WordEmphasis/WordEmphasis';

import * as u from '../../../../Shared/utility';
import c from './Bio.module.scss';
import _ from 'lodash';

const bio = (props) => {
  const { paragraphs, closing } = props;

  let mainText = paragraphs.map(paragraph => {
    if(u.isArrayGt(paragraph, 0)) {
      const emphasisParagraph = [];
      for(const words of paragraph) {
        if(u.isObject(words) && words.emphasis) {
          emphasisParagraph.push(
            <WordEmphasis key={words.phrase}>
              {words.phrase}
            </WordEmphasis> );
        } else {
          emphasisParagraph.push(words);
        } 
      }
      return <p key={paragraph} className={c.Bio__Paragraph}>{emphasisParagraph}</p>;
    } else {
      return <p key={paragraph} className={c.Bio__Paragraph}>{paragraph}</p>;
    }
  });

  mainText = _.flattenDeep(mainText);

  const closingString = closing.map(words => {
    if(u.isObject(words) && words.emphasis) {
      return (
        <WordEmphasis key={words.phrase}>
          {words.phrase}
        </WordEmphasis> );
    } 

    return <span key={words}>{words}</span>;
  })

  return (
    <div className={c.Bio}>
      {mainText}
      <p className={c.Bio__Closing}>{closingString}</p>
    </div>
  );
}
 
bio.propTypes = {
  paragraphs: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]))
  ])),
  closing: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]))
}

export default bio;