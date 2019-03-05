import React from 'react';
import { Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

// Used for wrapping layout to allow for animation when route changes
const animatedSwitch = WrappingComponent => 
  withRouter((props) => (
    <WrappingComponent {...props} uniqueKey={props.page[0]}>
      <Switch location={props.location}>{props.children}</Switch>
    </WrappingComponent>
  )
);

animatedSwitch.propTypes = {
  page: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default animatedSwitch;