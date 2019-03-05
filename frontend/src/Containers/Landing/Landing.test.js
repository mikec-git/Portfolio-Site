import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from 'react-testing-library';

import Landing from './Landing';
import initStore from '../../Store/Utility/initStore';

const renderWithRedux = (ui, store = initStore()) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          {ui}
        </MemoryRouter>
      </Provider>
    ),
    store
  }
};

const props = {
  page: [],
  routeAnim: {
    leave: '',
    appear: ''
  },
  changeRouteAnim: jest.fn(),
  animationCallback: jest.fn(),
  navIsOpen: false,
  images: {
    logo: {}
  }
}

describe('Landing page', () => {
  it('should render the landing page', () => {
    const { getByTestId } = renderWithRedux(<Landing {...props} />);
    
    expect(getByTestId('landingPage')).toBeVisible();
  });
  
  it('should link the landing button to portfolio', () => {
    const { getByText, getByTestId } = renderWithRedux(<Landing {...props} />);
    
    expect(getByText(/portfolio/i)).toBeInTheDocument();
    expect(getByTestId('landingBtn').getAttribute('href')).toEqual('/portfolio');
  });
});