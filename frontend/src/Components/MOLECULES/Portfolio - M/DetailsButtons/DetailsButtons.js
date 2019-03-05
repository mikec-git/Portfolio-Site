import React from 'react';
import PropTypes from 'prop-types';
import ProjectButton from '../../../ATOMS/UI - A/ProjectButton/ProjectButton';

const detailsButtons = (props) => {
  let viewProjectBtn = null;
  let codeBtn = (
    <ProjectButton
      elementRef={props.codeBtnRef}
      color={props.details.btnColor}
      txtColor={props.details.txtColor}
      text='View Code'
      url={props.details.codeUrl} />
  );
  
  if(props.details.name !== 'Portfolio') {  
    viewProjectBtn = (
      <ProjectButton 
        elementRef={props.projectBtnRef}
        color={props.details.btnColor}
        txtColor={props.details.txtColor}
        text='View Project'
        url={props.details.projectUrl} />
    );
  } 

  return (
    <>
      {codeBtn}
      {viewProjectBtn}
    </>
  );
}

detailsButtons.propTypes = {
  codeBtnRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  projectBtnRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  details: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
  ]).isRequired
}
 
export default detailsButtons;