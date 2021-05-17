import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { ControllerSocketContext, defaultValue } from '../../contexts/ControllerSocketContextProvider';
import { ConnectScreen } from './ConnectScreen';

afterEach(cleanup);
configure({ adapter: new Adapter() });
describe('Controller ConnectScreen', () => {
    const history = createMemoryHistory({ initialEntries: ['/ABCD'] });

    it('renders one intput html tag', () => {
        const { container } = render(
            <Router history={history}>
                <ConnectScreen history={history} />
            </Router>
        );
        expect(container.querySelectorAll('input')).toHaveProperty('length', 1);
    });

    it('should render Credits button', () => {
        const givenText = 'Credits';
        const { container } = render(
            <Router history={history}>
                <ConnectScreen history={history} />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render name input label', () => {
        const givenText = 'Enter your name:';
        const { container } = render(
            <Router history={history}>
                <ConnectScreen history={history} />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render Enter button', () => {
        const givenText = 'Enter';
        const { container } = render(
            <Router history={history}>
                <ConnectScreen history={history} />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when connect button is clicked, handleSocketConnection function should be called', () => {
        const handleSocketConnectionFunction = jest.fn();
        const wrapper = mount(
            <Router history={history}>
                <ControllerSocketContext.Provider
                    value={{ ...defaultValue, handleSocketConnection: handleSocketConnectionFunction }}
                >
                    <ConnectScreen history={history} />
                </ControllerSocketContext.Provider>
            </Router>
        );
        const nameInput = wrapper.find('input');
        const form = wrapper.find('form');

        nameInput.simulate('focus');
        nameInput.simulate('change', { target: { value: 'Name' } });

        form.simulate('submit');

        expect(handleSocketConnectionFunction).toHaveBeenCalledTimes(1);
    });
});
