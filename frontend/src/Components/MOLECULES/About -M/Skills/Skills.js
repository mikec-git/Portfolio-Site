import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Skill from '../../../ATOMS/About -A/Skill/Skill';
import c from './Skills.module.scss';
import * as u from '../../../../Shared/utility';

const skills = (props) => {
  const languages = [];
  const libraries = [];
  const tech      = [];

  for(const key in props.images) {
    const image = props.images[key];
    // Gets the skill type by filename first character
    const type  = key[0];
    if(key[2] === '-' || key[3] === '-') {
      // Language
      if(type === 'L') {
        languages.push({image, key});
        // Library/Framework
      } else if(type === 'F') {
        libraries.push({image, key});
        // Other Tech
      } else if(type === 'T') {
        tech.push({image, key});
      }
    }
  }

  // Mergesorts by filename order
  u.mergeSortImages(languages);
  u.mergeSortImages(libraries);
  u.mergeSortImages(tech);

  // Language skills
  const langSkills = languages.map(language => {
    return (
      <Skill 
        key={language.key}
        imgSrc={language.image.src}
        imgAlt={language.key} /> );
  });

  // Library and framework skills
  const libSkills = libraries.map(library => {
    return (
      <Skill 
        key={library.key}
        imgSrc={library.image.src}
        imgAlt={library.key} /> );
  });

  // Other misc tech skills (devops, design, etc...)
  const techSkills = tech.map(technology => {
    return (
      <Skill 
        key={technology.key}
        imgSrc={technology.image.src}
        imgAlt={technology.key} /> );
  });

  let skillsClasses = [c.Skills];
  let toggleClasses = [c.Skills__Toggle];
  const [isOpen, toggleOpen] = useState(false);
  if(isOpen) {
    skillsClasses.push(c.Skills_open);
    toggleClasses.push(c.Skills__Toggle_open);
  }

  return (
    <>
      <div onClick={() => toggleOpen(!isOpen)} className={toggleClasses.join(' ')}>
        <svg viewBox="0 0 128 128">
          <path className="cls-2" d="M105.72,54.9,73.14,39.42l-1.83-.9-1.12,2.28L64,53.41V68.3l9.15-18.08,21.5,9.57L71.56,70.16l-.87.47,0,1.56v6.18l0,3.14L73,80.38l32.78-15.69a2,2,0,0,0,.92-2V56.91A2,2,0,0,0,105.72,54.9Z"></path>
          <path className="cls-1" d="M56,69.39l-21.79-9.6L57.51,49.42l1.76-.7,0-1.33V37.76L55.87,39.2,21.94,54.89a2.26,2.26,0,0,0-1.28,2v5.77a2.22,2.22,0,0,0,1.24,2L55.34,80.18l2,.9,1.21-2.26L64,68.3V53.41Z"></path>
        </svg>
      </div>
      <div className={skillsClasses.join(' ')}>
        <div className={c.Skills__Lang}>
          <h3 className={c.Skills__Title}>Languages I Speak</h3>
          <div className={c.Skills__Skills}>{langSkills}</div>
        </div>
        <div className={c.Skills__Lib}>
          <h3 className={c.Skills__Title}>Libraries &amp; Frameworks</h3>
          <div className={c.Skills__Skills}>{libSkills}</div>
        </div>
        <div className={c.Skills__Tech}>
          <h3 className={c.Skills__Title}>Technologies</h3>
          <div className={c.Skills__Skills}>{techSkills}</div>
        </div>
      </div>
    </>
  );
}

skills.propTypes = {
  images: PropTypes.objectOf(PropTypes.object).isRequired
}
 
export default skills;