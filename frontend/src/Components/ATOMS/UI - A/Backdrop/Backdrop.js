import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';
import c from './Backdrop.module.scss';

const backdrop = (props) => {
  return (
    <CSSTransition
      in={props.isOpen}
      mountOnEnter
      unmountOnExit
      timeout={950}
      classNames={{
        enter: c.Backdrop_enter,
        enterActive: c.Backdrop_enter_active,
        enterDone: c.Backdrop_enter_done,
        exit: c.Backdrop_exit,
        exitActive: c.Backdrop_exit_active,
        exitDone: c.Backdrop_exit_done,
      }}
      onEnter={() => props.stateChanged(true)}
      // Delay so animation can fully finish
      onEntered={() => setTimeout(() => props.stateChanged(false), 100)}
      onExit={() => props.stateChanged(true)}
      onExited={() => props.stateChanged(false)}>
      <div 
        data-testid='backdrop'
        className={c.Backdrop}
        onClick={props.backdropClicked}
        >
      </div>  
    </CSSTransition>
  )
};

backdrop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  backdropClicked: PropTypes.func,
  stateChanged: PropTypes.func.isRequired
}

export default backdrop;