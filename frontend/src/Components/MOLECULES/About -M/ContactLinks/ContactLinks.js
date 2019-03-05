import React from 'react';
import PropTypes from 'prop-types';

import ContactLink from '../../../ATOMS/About -A/ContactLink/ContactLink';
import * as u from '../../../../Shared/utility';
import c from './ContactLinks.module.scss';

const contactLinks = (props) => {
  const links = [];

  for(const key in props.images) {
    const image = props.images[key];
    const type  = key[0];
    if(key[2] === '-') {
      if(type === 'C') {
        links.push({image, key});
      }
    }
  }
  u.mergeSortImages(links);

  const allLinks = links.map(language => {
    return (
      <ContactLink 
        key={language.key}
        imgSrc={language.image.src}
        imgAlt={language.key} />);
  });

  return (
    <div ref={props.elementRef} className={c.ContactLinks}>
      {allLinks}
    </div>
  );
}

contactLinks.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  images: PropTypes.objectOf(PropTypes.object).isRequired
}
 
export default contactLinks;