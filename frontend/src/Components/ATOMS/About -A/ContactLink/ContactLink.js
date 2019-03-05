import React from 'react';
import PropTypes from 'prop-types';
import c from './ContactLink.module.scss';
import resume from '../../../../Assets/pdf/resume.pdf';

const contactLink = (props) => {
  let linkType = /[\d\w_]+(?=\.(svg|png|jpg))/.exec(props.imgAlt)[0];;
  let url = resume;
  let target = '_blank';
  let rel = "noopener noreferrer";
  
  if(linkType === 'GitHub') {
    url = 'https://github.com/';
  } else if(linkType === 'linkedIn') {
    url = 'https://www.linkedin.com/';
  } else if(linkType === 'CodePen') {
    url = 'https://codepen.io/';
  } else if(linkType === 'Email') {
    url = 'mailto:someone@gmail.com?subject=Re: Message from portfolio!';
    target = null;
    rel = null;
  }
  
  let link = (
    <img 
      className={c.ContactLink__Image}
      src={props.imgSrc} 
      alt={linkType} />
  );

  return (
    <a 
      className={c.ContactLink} 
      href={url} 
      target={target}
      rel={rel}>
      {link}
      <h5 className={c.ContactLink__Name}>{linkType}</h5>
    </a>
  );
}
 
contactLink.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired
}

export default contactLink;