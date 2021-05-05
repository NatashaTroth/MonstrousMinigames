import { cleanup, queryByText, render } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ControllerSocketContext, defaultValue } from '../../contexts/ControllerSocketContextProvider';
import { ConnectScreen } from './ConnectScreen';

afterEach(cleanup);
configure({ adapter: new Adapter() });
describe('Controller ConnectScreen', () => {
    it('renders two intput html tags', () => {
        const { container } = render(
            <Router>
                <ConnectScreen />
            </Router>
        );
        expect(container.querySelectorAll('input')).toHaveProperty('length', 2);
    });

    it('should render impressum link', () => {
        const givenText = 'Impressum';
        const { container } = render(
            <Router>
                <ConnectScreen />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render name input', () => {
        const givenText = 'Name';
        const { container } = render(
            <Router>
                <ConnectScreen />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render room input', () => {
        const givenText = 'Room Code';
        const { container } = render(
            <Router>
                <ConnectScreen />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('should render connect button', () => {
        const givenText = 'Connect';
        const { container } = render(
            <Router>
                <ConnectScreen />
            </Router>
        );
        expect(queryByText(container, givenText)).toBeTruthy();
    });

    it('when connect button is clicked, handleSocketConnection function should be called', () => {
        const handleSocketConnectionFunction = jest.fn();
        const wrapper = mount(
            <Router>
                <ControllerSocketContext.Provider
                    value={{ ...defaultValue, handleSocketConnection: handleSocketConnectionFunction }}
                >
                    <ConnectScreen />
                </ControllerSocketContext.Provider>
            </Router>
        );
        const nameInput = wrapper.find('input').at(0);
        const roomInput = wrapper.find('input').at(1);
        const form = wrapper.find('form');

        nameInput.simulate('focus');
        nameInput.simulate('change', { target: { value: 'Name' } });
        roomInput.simulate('focus');
        roomInput.simulate('change', { target: { value: 'Room Code' } });

        form.simulate('submit');

        expect(handleSocketConnectionFunction).toHaveBeenCalledTimes(1);
    });
});
