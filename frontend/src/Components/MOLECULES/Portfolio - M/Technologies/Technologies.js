import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Tech from '../../../ATOMS/Project - A/Tech/Tech';

import * as u from '../../../../Shared/utility';
import c from './Technologies.module.scss';

const technologies = (props) => {
  let technologies = null;
  const imagesLoaded = Object.keys(props.images).length > 0;

  // If techlist provided and images loaded...
  if(props.techList && imagesLoaded) {
    technologies = props.techList.map(tech => {   
      let skillName = u.getTechnologyName(tech);
      return (
        <Tech
          key={tech}
          techName={skillName}
          imgSrc={props.images[tech].src}
          imgAlt={skillName} />
      );
    });
  }

  return (
    <div>
      <h3 className={c.Technologies__Title}>{props.techType}</h3>
      <div className={c.Technologies}>{technologies}</div>
    </div>
  );
}

technologies.propTypes = {
  images: PropTypes.objectOf(PropTypes.object.isRequired).isRequired,
  techType: PropTypes.string.isRequired,
  techList: PropTypes.arrayOf(PropTypes.string).isRequired
}

const mapStateToProps = state => {
  return {
    images: state.ui.images
  }
}
 
export default connect(mapStateToProps, null)(technologies);