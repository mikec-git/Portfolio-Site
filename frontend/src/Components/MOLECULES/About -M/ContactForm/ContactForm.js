import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

import Button from '../../../ATOMS/UI - A/Button/Button';
import ContactInput from '../../../ATOMS/About -A/ContactInput/ContactInput';
import ProgressLogo from '../../../ATOMS/UI - A/ProgressLogo/ProgressLogo';

import * as contactActions from '../../../../Store/Actions/ContactActions';
import c from './ContactForm.module.scss';

const contactForm = (props) => {
  const [inputValues, setInputValues] = useState({
    nameVal: '',
    emailVal: '',
    messageVal: ''
  });

  const [isValidated, setIsValidated] = useState({
    name: null,
    email: null,
    message: null,
  });

  const [error, setError] = useState({
    name: null,
    email: null,
    message: null,
    server: null
  });

  // Called when the errors change after submitting form...
  useEffect(() => {
    setError({ 
      name: props.sendError.name[0],
      email: props.sendError.email[0],
      message: props.sendError.message[0],
      server: props.sendError.server[0]
    })
  }, [props.sendError.name[0], props.sendError.email[0], props.sendError.message[0], props.sendError.server[0]]);
  
  // Changes the value of the input when client types...
  function onChangeHandler(e, type) {
    let valName = `${type}Val`;
    const validatedVal = validateInput(e.target.value, type);

    setInputValues({ ...inputValues, [valName]: e.target.value });
    setIsValidated({ ...isValidated, [type]: validatedVal });
  }

  // Form validation on clientside...
  function validateInput(value, type) {
    let regex = null;
    if(type === 'name') {
      regex = /^(\s*[a-zA-Z]+\s*)+$/;
    } else if(type === 'email') {
      regex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    } else if(type === 'message') {
      regex = /^(\s*\S+\s*)+$/;
    }
    return regex.test(value);
  }

  // Attempts to send message through server...
  function SendMessageHandler() {
    const message = {
      name: inputValues.nameVal,
      email: inputValues.emailVal,
      message: inputValues.messageVal
    };

    props.onSendMessage(message);
  }
  
  const { nameVal, emailVal, messageVal } = inputValues;
  const nameClasses     = [c.ContactForm__Name];
  const emailClasses    = [c.ContactForm__Email];
  const messageClasses  = [c.ContactForm__Message];
  const cssTransitionClasses = {
    enter: c.ContactForm_enter,
    enterActive: c.ContactForm_enter_active,
    enterDone: c.ContactForm_enter_done,
    exit: c.ContactForm_exit,
    exitActive: c.ContactForm_exit_active,
    exitDone: c.ContactForm_exit_done,
  };

  // If ___ is not validated and input isn't empty...
  // OR if ___ has an error and input is empty...
  if((!isValidated.name && nameVal !== '') || (!!error.name && nameVal === '')) {
    nameClasses.push(c.ContactForm__Name_notValidated);
  } else {
    nameClasses.push(c.ContactForm__Name_validated);      
  }

  if((!isValidated.email && emailVal !== '') || (!!error.email && emailVal === '')) {
    emailClasses.push(c.ContactForm__Email_notValidated);
  } else {
    emailClasses.push(c.ContactForm__Email_validated);      
  }

  if((!isValidated.message && messageVal !== '') || (!!error.message && messageVal === '')) {
    messageClasses.push(c.ContactForm__Message_notValidated);
  } else {
    messageClasses.push(c.ContactForm__Message_validated);
  }

  // Constructs error messages for each input and server...
  let errorMessages = {};
  for (const key in error) {
    let messageElement = null;
    if(key !== 'server') {
      messageElement = <span className={c.ContactForm__Error}>{error[key]}</span>;
    } else {
      messageElement = <span className={[c.ContactForm__Error, c.ContactForm__Error_server].join(' ')}>{error.server}</span>;
    }

    errorMessages[key] = (
      <CSSTransition
        in={!!error[key]}
        timeout={500}
        mountOnEnter
        unmountOnExit
        classNames={cssTransitionClasses}>
        {messageElement}
      </CSSTransition>
    );
  }

  return (
    <>
      <CSSTransition
        in={!props.loading && !props.isSent}
        timeout={500}
        mountOnEnter
        classNames={cssTransitionClasses}>
        <div className={c.ContactForm}>
          <div className={nameClasses.join(' ')}>
            {errorMessages['name']}
            <ContactInput
              type='text'
              inputCategory='name'
              inputConfig={{type: "text", name: "name", id: "name", autoComplete: 'off', value: nameVal}} 
              isValidated={!!isValidated.name}
              onChange={(e) => onChangeHandler(e, 'name')} />
          </div>
          <div className={emailClasses.join(' ')}>
            {errorMessages['email']}
            <ContactInput
              type='text'
              inputCategory='email'
              inputConfig={{type: "text", name: "email", id: "email", autoComplete: 'off', value: emailVal}} 
              isValidated={!!isValidated.email}
              onChange={(e) => onChangeHandler(e, 'email')} />
          </div>
          <div className={messageClasses.join(' ')}>
            {errorMessages['message']}
            <ContactInput
              type='textarea'
              inputCategory='message'
              inputConfig={{name: "message", id: "message", cols: "30", rows: "10", autoComplete: "off", value: messageVal}}
              isValidated={!!isValidated.message}
              onChange={(e) => onChangeHandler(e, 'message')} />
          </div>
          <Button 
            submitMail={SendMessageHandler}
            text='Send Message' 
            color='blue3' />
          {errorMessages['server']}
        </div>
      </CSSTransition>
      <CSSTransition 
        in={props.loading && !props.isSent}
        timeout={500}
        mountOnEnter
        unmountOnExit
        classNames={cssTransitionClasses}>
        <ProgressLogo context='contactForm' />
      </CSSTransition>
      <CSSTransition 
        in={props.isSent}
        timeout={500}
        mountOnEnter
        unmountOnExit
        classNames={cssTransitionClasses}>
        <p className={c.ContactForm__SentConfirmation}>
          <span className={c.ContactForm__SentConfirmation_text}>Thanks for reaching out.</span>
          <span className={c.ContactForm__SentConfirmation_text}>I'll be in touch soon!</span>
        </p>
      </CSSTransition>
    </>
  );
}

contactForm.propTypes = {
  sendError: PropTypes.objectOf(PropTypes.array.isRequired).isRequired,
  statusCode: PropTypes.number,
  isSent: PropTypes.bool,
  loading: PropTypes.bool
}

const mapStateToProps = state => {
  return {
    sendError: state.contact.error,
    statusCode: state.contact.statusCode,
    isSent: state.contact.isSent,
    loading: state.contact.loading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onSendMessage: (message) => dispatch(contactActions.sendMessage(message))
  }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(contactForm);