import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from 'react-testing-library';
import { Provider } from 'react-redux';
import initStore from '../../../Store/Utility/initStore';

import Navigation from './Navigation';

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

// Initial props state required to run the component...
const props = {
  page: [],
  changeRouteAnim: jest.fn()
}
const leftClick = {button: 0};

describe('navigation toggle', () => {  
  it('should render hamburger without backdrop or navitems', () => {
    // Renders Navigation comp with redux and BrowserRouter...
    const { getByTestId, queryByTestId } = renderWithRedux(
      <Navigation {...props} />
    );
      
    expect(getByTestId('hamburger')).toBeVisible();
    expect(queryByTestId('backdrop')).toBeNull();
    expect(queryByTestId('navitems')).toBeNull();
  });
  
  jest.useFakeTimers();
  
  it('should open backdrop & navitems when hamburger menu clicked and close once hamburger clicked again after opening animations are all finished', () => {
    const { getByTestId, queryByTestId } = renderWithRedux(
      <Navigation {...props} />
    );
    

    // Should see nav opened when hamburger clicked...
    fireEvent.click(getByTestId('hamburger'), leftClick);
    expect(getByTestId('backdrop')).toBeVisible();
    expect(getByTestId('navitems')).toBeVisible();

    // Wait for hamburger open anim to finish...
    setTimeout(() => {
      fireEvent.click(getByTestId('hamburger'), leftClick);
      // Wait for close anim to finish...
      setTimeout(() => {
        expect(queryByTestId('backdrop')).toBeNull();
        expect(queryByTestId('navitems')).toBeNull();
      }, 1000);
    }, 1000);

    jest.runAllTimers();
  });
  
  it('should close navigation if backdrop clicked', () => {
    const { getByTestId, queryByTestId } = renderWithRedux(
      <Navigation {...props} />
    );
    
    // Should see nav opened when hamburger clicked...
    fireEvent.click(getByTestId('hamburger'), leftClick);
    expect(getByTestId('backdrop')).toBeVisible();
    expect(getByTestId('navitems')).toBeVisible();

    // Wait for hamburger open anim to finish...
    setTimeout(() => {
      fireEvent.click(getByTestId('backdrop'), leftClick);
      // Wait for close anim to finish...
      setTimeout(() => {
        expect(queryByTestId('backdrop')).toBeNull();
        expect(queryByTestId('navitems')).toBeNull();
      }, 1000);
    }, 1000);

    jest.runAllTimers();
  });
});

describe('navigation links', () => {
  it('should should have proper pathnames', async () => {
    const navToggleHandler = jest.fn();
    const newProps = {...props, navToggleHandler};

    const { getByTestId, queryByText, getByText } = renderWithRedux(
      <Navigation {...newProps} />
    );

    fireEvent.click(getByTestId('hamburger'), leftClick);
    expect(getByTestId('backdrop')).toBeVisible();
    expect(getByTestId('navitems')).toBeVisible();

    // NavItems should all be visible
    expect(getByText('Home')).toBeVisible();
    expect(getByText('Portfolio')).toBeVisible();
    expect(getByText('About')).toBeVisible();
    expect(getByText('Resume')).toBeVisible();
    expect(queryByText('Landing')).toBeFalsy();
    
    // All should have the correct paths
    expect(getByTestId('Home Link').getAttribute('href')).toEqual('/');
    expect(getByTestId('Portfolio Link').getAttribute('href')).toEqual('/portfolio');
    expect(getByTestId('About Link').getAttribute('href')).toEqual('/about');
    expect(getByTestId('Resume Link').getAttribute('href')).toBeFalsy();
  });
})