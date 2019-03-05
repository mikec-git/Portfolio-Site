import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from 'react-testing-library';
import { Provider } from 'react-redux';
import initStore from '../../../Store/Utility/initStore';

import Project from './Project';
import slides from '../ThreeJsBackground/slides';

const renderWithRedux = (ui, store=initStore()) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </Provider>
    ),

    // Adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  }
};

const props = {
  animating: false,
  fontColor: '',
  descColor: '',
  yearColor: '',
  changeProject: jest.fn(),
  routeAnim: {},
  animatingProject: {
    id: {},
    anim: {}
  },
  onComplete: jest.fn(),
  onFinishLeave: jest.fn()
}

describe('portfolio project page', () => {
  it('should display portfolio project page', () => {
    const portfolioSlide = slides['portfolio'][0];
    const newProps = {
      ...props, 
      id: portfolioSlide['projectId'], 
      details: { ...portfolioSlide['details'] }
    };

    const { getByText } = renderWithRedux(<Project {...newProps} />);
    expect(getByText('Portfolio')).toBeVisible();
  });
});

describe('project button and code button', () => {
  it('should show project button for portfolio page', () => {
    const portfolioSlide = slides['portfolio'][0];
    const newProps = {
      ...props, 
      id: portfolioSlide['projectId'], 
      details: { ...portfolioSlide['details'] }
    };

    const { getByText, queryByText, getByTestId } = renderWithRedux(<Project {...newProps} />);
    
    expect(getByText('Portfolio')).toBeVisible();
    expect(getByText('View Code')).toBeVisible();
    expect(queryByText('View Project')).toBeNull();
    expect(getByTestId('projectBtn')).toHaveAttribute('href', portfolioSlide.codeUrl);
  })
  
  it('should show project and code buttons for filmbase page', () => {
    const portfolioSlide = slides['portfolio'][1];
    const newProps = {
      ...props, 
      id: portfolioSlide['projectId'], 
      details: { ...portfolioSlide['details'] }
    };

    const { debug, getByText, getAllByTestId } = renderWithRedux(<Project {...newProps} />);

    expect(getByText('Film Base')).toBeVisible();
    expect(getByText('View Code')).toBeVisible();
    expect(getByText('View Project')).toBeVisible();
    
    const buttons = getAllByTestId('projectBtn');
    expect(buttons).toHaveLength(2);
    
    expect(buttons[0]).toHaveTextContent(/view code/i);
    expect(buttons[1]).toHaveTextContent(/view project/i);
    
    expect(buttons[0]).toHaveAttribute('href');
    expect(buttons[0].getAttribute('href')).toEqual(portfolioSlide['details'].codeUrl);

    expect(buttons[1]).toHaveAttribute('href');
    expect(buttons[1].getAttribute('href')).toEqual(portfolioSlide['details'].projectUrl);
  })
});