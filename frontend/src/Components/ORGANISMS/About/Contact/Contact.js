import React from 'react';
import PropTypes from 'prop-types';

import TypewriterEffect from '../../../ATOMS/UI - A/TypewriterEffect/TypewriterEffect';
import TitleMain from '../../../ATOMS/UI - A/TitleMain/TitleMain';
import TitleSecondary from '../../../ATOMS/UI - A/TitleSecondary/TitleSecondary';
import ContactForm from '../../../MOLECULES/About -M/ContactForm/ContactForm';
import c from './Contact.module.scss';

const contact = (props) => {
  return (
    <section 
      data-testid='contactPage'
      ref={props.elementRef} 
      className={c.Contact} >
      <div className={c.Contact__Text}>
        <TitleMain
          text={`Are You Hiring?`}
          context='contact'
          isNotSeparate />
        <TitleSecondary 
          animating={props.animating}
          text={`Let's `}
          context='contact'
          isNotSeparate />
        <TypewriterEffect
          words={['Chat', 'Collab', 'Code']}
          isVisible={props.pageState === 'contact'}
          context='about' />
      </div>
      <ContactForm />
    </section>
  );
}

contact.propTypes = {
  elementRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  animating: PropTypes.bool.isRequired,
  pageState: PropTypes.string.isRequired
}
 
export default contact;