import 'jest-dom/extend-expect';
import 'react-testing-library/cleanup-after-each';

import React from 'react';
import { render } from 'react-testing-library';
import Skill from './Skill.js';

import skillImg from '../../../../Assets/img/Skills/F3-ASP_NET__Core.png';
import c from './Skill.module.scss';

test('renders the ASP.NET Core skill icon and name', () => {
  const { getByText, getByAltText } = render(
    <Skill 
      imgAlt='F3-ASP_NET__Core.png'
      imgSrc={skillImg} />);

  const iconTitle = getByText('ASP.NET Core');
  const iconImg = getByAltText('ASP.NET Core');

  // Checks if icon title matches the proper logo...
  expect(iconTitle).toHaveClass(c.Skill__Name);
  // Checks if image matches the proper img src...
  expect(iconImg).toHaveAttribute('src', skillImg);
});