import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount } from 'enzyme';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { defaultValue, ScreenSocketContext } from '../../contexts/ScreenSocketContextProvider';
import ConnectDialog from './ConnectDialog';

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
                    <ConnectDialog
                        open={true}
                        handleClose={() => {
                            //do nothing
                        }}
                    />
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
