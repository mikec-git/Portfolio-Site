import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import React from 'react';
import { render, fireEvent, wait } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import initStore from '../../Store/Utility/initStore';
import About from './About';

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
}

const props = {
  page: [],
  addFocus: jest.fn(),
  removeFocus: jest.fn(),
  routeAnim: {},
  animationCallback: jest.fn(),
  images: {
    image: { }
  }
}

jest.useFakeTimers();

describe('about and contact page', () => {
  it('should render the about page and contact page not visible', () => {
    const { getByTestId } = renderWithRedux(<About {...props} />);
    
    expect(getByTestId('aboutPage')).toBeVisible();
    expect(getByTestId('contactPage')).not.toBeVisible();
  });

  it(`should hide about page on clicking "Let's Chat" toggle button and reveal contact page`, async () => {
    const { getByTestId, getByText } = renderWithRedux(<About {...props} />);
    
    expect(getByText(`Let's Chat!`)).toBeVisible();
    fireEvent.click(document.querySelector('.ToggleBtn_bottom'));

    await wait(() => {
      expect(getByTestId('contactPage')).toBeVisible();  
    })
    
    expect(getByTestId('contactPage')).toBeVisible();

    await wait(() => {
      expect(getByTestId('aboutPage')).not.toBeVisible();
    })
    
    expect(getByTestId('aboutPage')).not.toBeVisible();
    expect(getByTestId('contactPage')).toBeVisible();
  });
  
  it(`should hide contact page on clicking "Me, Myself, and I" toggle button and reveal about page`, async () => {
    const { getByTestId, getByText } = renderWithRedux(<About {...props} />);
    
    expect(getByText(`Me, Myself, and I`)).toBeVisible();
    fireEvent.click(document.querySelector('.ToggleBtn_bottom'));
    
    await wait(() => expect(getByTestId('contactPage')).toBeVisible());
    
    expect(getByTestId('contactPage')).toBeVisible();
    
    await wait(() => expect(getByTestId('aboutPage')).toHaveStyle(`opacity: 0;`));
    
    expect(getByTestId('aboutPage')).not.toBeVisible();

    await wait(() => expect(document.querySelector('.ToggleBtn_top')).toHaveStyle(`
      opacity: 1;
    `));
    
    fireEvent.click(document.querySelector('.ToggleBtn_top'));
    await wait(() => expect(document.querySelector('.ToggleBtn_bottom')).toHaveStyle(`
      opacity: 1;
    `));

    expect(getByTestId('aboutPage')).toBeVisible();
    expect(getByTestId('contactPage')).not.toBeVisible();
  });
});