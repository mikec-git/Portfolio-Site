import React from 'react';
import PropTypes from 'prop-types';
import * as u from '../../../../Shared/utility';
import c from './Skill.module.scss';

const skill = (props) => {
  let skillName = u.getTechnologyName(props.imgAlt);

  return ( 
    <div className={c.Skill}>
      <div className={c.Skill__ImageWrapper}>
        <img 
          className={c.Skill__Image}
          src={props.imgSrc} 
          alt={skillName}/>
      </div>
      <div className={c.Skill__NameWrapper}>
        <h5 className={c.Skill__Name}>{skillName}</h5>
      </div>
    </div>
  );
}

skill.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired
}
 
export default skill;