import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from 'react-testing-library';

import LandingBtn from './LandingBtn';

const renderWithRouter = (ui) => {
  return {
    ...render(
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    )
  }
};

const props = {
  routeChange: jest.fn()
}

const leftClick = {button: 0}

describe('Landing page button', () => {
  it('should render the landing page button', () => {
    const { getByTestId } = renderWithRouter(<LandingBtn {...props} />);
    
    expect(getByTestId('landingBtn')).toBeVisible();
  });
  
  it('should invoke route change function when clicked', () => {
    const { getByTestId } = renderWithRouter(<LandingBtn {...props} />);
    
    fireEvent.click(getByTestId('landingBtn'), leftClick);
    expect(props.routeChange).toHaveBeenCalled();
    expect(props.routeChange).toHaveBeenCalledTimes(1);
  });
});