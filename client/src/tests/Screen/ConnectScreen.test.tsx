import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ConnectScreen } from '../../components/Screen/ConnectScreen';
import { defaultValue, ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';

configure({ adapter: new Adapter() });
afterEach(cleanup);
describe('Screen ConnectScreen', () => {
    it('when connect button is clicked, handleSocketConnection function should be called', () => {
        const handleSocketConnectionFunction = jest.fn();
        const wrapper = mount(
            <Router>
                <ScreenSocketContext.Provider
                    value={{ ...defaultValue, handleSocketConnection: handleSocketConnectionFunction }}
                >
                    <ConnectScreen />
                </ScreenSocketContext.Provider>
            </Router>
        );
        const input = wrapper.find('input');
        const form = wrapper.find('form');

        input.simulate('focus');
        input.simulate('change', { target: { value: 'RoomCode' } });
        input.simulate('keyDown', {
            which: 27,
            target: {
                blur() {
                    input.simulate('blur');
                },
            },
        });
        form.simulate('submit');

        expect(handleSocketConnectionFunction).toHaveBeenCalledTimes(1);
    });
});
