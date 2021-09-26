import { cleanup } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure, mount, shallow } from 'enzyme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { defaultValue as screenDefaultValue, ScreenSocketContext } from '../../../contexts/ScreenSocketContextProvider';
import theme from '../../../styles/theme';
import { InMemorySocketFake } from '../../socket/InMemorySocketFake';
import { ConnectScreen } from './ConnectScreen';

configure({ adapter: new Adapter() });

afterEach(cleanup);
describe('Screen ConnectScreen', () => {
    const socket = new InMemorySocketFake();
    const ConnectScreenComponent = (
        <ThemeProvider theme={theme}>
            <ScreenSocketContext.Provider value={{ ...screenDefaultValue, screenSocket: socket }}>
                <ConnectScreen />
            </ScreenSocketContext.Provider>
        </ThemeProvider>
    );

    it('renders given button labels', () => {
        const buttonLabels = ['Create New Room', 'Join Room', 'About', 'Credits', 'Settings'];
        const container = shallow(ConnectScreenComponent);
        buttonLabels.forEach(label => {
            expect(container.find(label)).toBeTruthy();
        });
    });

    it('renders 5 buttons', () => {
        const container = mount(ConnectScreenComponent);
        const buttons = container.find('button');
        expect(buttons.length).toEqual(5);
    });

    /* it('each button is clickable and calls the onclick method', () => {
        const onClick = jest.fn()
        const container = mount(
            ConnectScreenComponent
        );
        const buttons = container.find('button');
        if (buttons) {
            buttons.forEach(button => {
                button.simulate('click')
                expect(onClick).toHaveBeenCalled();
            });
            expect(onClick).toHaveBeenCalledTimes(buttons.length);
       } 
    });  */
});
