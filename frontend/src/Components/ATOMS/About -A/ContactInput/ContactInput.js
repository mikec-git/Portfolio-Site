import React from 'react';
import PropTypes from 'prop-types';
import c from './ContactInput.module.scss';

const contactInput = (props) => {
  let labelClasses = props.inputConfig.value !== '' ? [c.ContactInput__LabelFull] : [c.ContactInput__Label];
  let inputClasses = [c.ContactInput__Input];

  if(props.inputCategory === 'name') {
    inputClasses.push(c.ContactInput__Input_name);
    labelClasses.push(c.ContactInput__Label_name);
  } else if(props.inputCategory === 'email') {
    inputClasses.push(c.ContactInput__Input_email);
    labelClasses.push(c.ContactInput__Label_email);
  } else if(props.inputCategory === 'message') {
    inputClasses.push(c.ContactInput__Input_message);
    labelClasses.push(c.ContactInput__Label_message);
  }

  // If input is validated or empty...
  if(props.isValidated || props.inputConfig.value === '') {
    inputClasses.push(c.ContactInput__Input_validated);
  } else {
    inputClasses.push(c.ContactInput__Input_notValidated);
  }

  let input = null;
  if(props.type === 'text') {
    input = (
      <input 
        className={inputClasses.join(' ')}
        {...props.inputConfig}
        onChange={props.onChange} />
    );
  } else if(props.type === 'textarea') {
    input = (
      <textarea 
        className={inputClasses.join(' ')}
        {...props.inputConfig}
        onChange={props.onChange}>
      </textarea>
    );
  } 

  return ( 
    <div className={c.ContactInput}>
      {input}
      <label 
        className={labelClasses.join(' ')} 
        htmlFor={props.inputConfig.id}>
        {props.inputConfig.id}
      </label>
    </div>
  );
}

contactInput.propTypes = {
  type: PropTypes.string.isRequired,
  inputCategory: PropTypes.string.isRequired,
  inputConfig: PropTypes.objectOf(PropTypes.string).isRequired,
  isValidated: PropTypes.bool,
  onChange: PropTypes.func.isRequired
}
 
export default contactInput;