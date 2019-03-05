import 'react-testing-library/cleanup-after-each';
import 'jest-dom/extend-expect';

import React from 'react';
import { render } from 'react-testing-library';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import userEvent from 'user-event';

import initStore from '../../../../Store/Utility/initStore';
import Contact from './Contact';

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
  animating: false,
  pageState: 'contact'
}

jest.useFakeTimers();

describe('contact form', () => {
  it('should render the contact form', () => {
    const { getByLabelText, getByText, debug } = renderWithRedux(<Contact {...props} />);
  
    expect(getByLabelText('name')).toBeVisible();
    expect(getByLabelText('email')).toBeVisible();
    expect(getByLabelText('message')).toBeVisible();
    expect(getByText('Send Message')).toBeVisible();
    
    // Check if inputs are all in the DOM
    expect(document.querySelector('#name')).toBeInTheDocument();
    expect(document.querySelector('#email')).toBeInTheDocument();
    expect(document.querySelector('#message')).toBeInTheDocument();
  });
  
  it('should show typed values in inputs', () => {
    const { } = renderWithRedux(<Contact {...props} />);
  
    userEvent.type(document.querySelector('#name'), 'Jane Jones');
    userEvent.type(document.querySelector('#email'), '@Eam');
    userEvent.type(document.querySelector('#message'), 'Test Message');
    expect(document.querySelector('#name')).toHaveAttribute('value', 'Jane Jones');
    expect(document.querySelector('#email')).toHaveAttribute('value', '@Eam');
    expect(document.querySelector('#message')).toHaveTextContent('Test Message');
  });
  
  it('should fail form validation', () => {
    renderWithRedux(<Contact {...props} />);
  
    userEvent.type(document.querySelector('#name'), '6');
    userEvent.type(document.querySelector('#email'), '@Eam');
    userEvent.type(document.querySelector('#message'), ' ');

    expect(document.querySelector('#name')).not.toHaveClass('ContactInput__Input_validated');
    expect(document.querySelector('#email')).not.toHaveClass('ContactInput__Input_validated');
    expect(document.querySelector('#message')).not.toHaveClass('ContactInput__Input_validated');

    expect(document.querySelector('#name')).toHaveClass('ContactInput__Input_notValidated');
    expect(document.querySelector('#email')).toHaveClass('ContactInput__Input_notValidated');
    expect(document.querySelector('#message')).toHaveClass('ContactInput__Input_notValidated');
  });
  
  it('should pass form validation', () => {
    renderWithRedux(<Contact {...props} />);
  
    userEvent.type(document.querySelector('#name'), 'Mike');
    userEvent.type(document.querySelector('#email'), 'Mike.C@gmail.com');
    userEvent.type(document.querySelector('#message'), 'Test Message');

    expect(document.querySelector('#name')).not.toHaveClass('ContactInput__Input_notValidated');
    expect(document.querySelector('#email')).not.toHaveClass('ContactInput__Input_notValidated');
    expect(document.querySelector('#message')).not.toHaveClass('ContactInput__Input_notValidated');
    
    expect(document.querySelector('#name')).toHaveClass('ContactInput__Input_validated');
    expect(document.querySelector('#email')).toHaveClass('ContactInput__Input_validated');
    expect(document.querySelector('#message')).toHaveClass('ContactInput__Input_validated');
  });
  
  it('should show loading spinner when send button clicked', () => {
    const { getByTestId, getByText } = renderWithRedux(<Contact {...props} />);
    
    // Check if inputs are all in the DOM
    expect(document.querySelector('#name')).toBeInTheDocument();
    expect(document.querySelector('#email')).toBeInTheDocument();
    expect(document.querySelector('#message')).toBeInTheDocument();

    userEvent.click(getByText('Send Message'));
    expect(getByTestId('progressLogo')).toBeInTheDocument();
  });
});